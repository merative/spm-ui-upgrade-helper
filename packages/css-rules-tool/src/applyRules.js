const css = require('css');

/**
 * Apply the given user rules to the CSS. Uses `contents` as input for a CSS abstract syntax tree.
 * Applies the user rules and returns the modified contents.
 *
 * @param {object} userRules user rules to apply
 * @param {string} contents file contents
 * @param {string} filename input filename, only used for error messages
 * @returns {string} CSS data with the given rules applied
 */
const applyRules = (userRules, contents, filename) => {
  const options = { silent: false, source: filename };
  const ast = css.parse(contents, options);
  let fileModified = false;

  for(let i = 0; i < ast.stylesheet.rules.length; i++) {
    const rule = ast.stylesheet.rules[i];
    if(rule.type != "rule") { // Skip anything that isn't a rule
      continue;
    }

    const selectorsBefore = JSON.stringify(rule.selectors);
    rule.selectors = applyRemoveSelectors(rule.selectors, userRules.SelectorRemove);
    rule.selectors = applyReplaceSelectors(rule.selectors, userRules.SelectorReplace);
    const selectorsAfter = JSON.stringify(rule.selectors);

    // If all selectors are gone then delete the CSS rule body
    if(rule.selectors.length == 0) {
      ast.stylesheet.rules.splice(i, 1);
      i--;
    }

    if(selectorsAfter != selectorsBefore) {
      fileModified = true;
    }
  }

  return fileModified ? css.stringify(ast).split("\n") : contents;
}

/**
 * Applies the 'SelectorRename' user rules to the given CSS.
 *
 * @param {object} selectors CSS selectors to potentially modify
 * @param {object} userRules user rules to apply
 * @returns {string} CSS data with the given rules applied
 */
const applyReplaceSelectors = (selectors, userRules) => {
  for(let i = 0; i < selectors.length; i++) {
    for(let j = 0; j < userRules.length; j++) {
      if(selectors[i].indexOf(userRules[j].value) != -1) {
        selectors[i] = selectors[i].replace(userRules[j].value, userRules[j].newValue).trim();
        selectors[i] = selectors[i].replace(/\s{2,}/, " ");
      }
    }
  }
  return selectors;
}

/**
 * Applies the 'SelectorRemove' user rules to the given CSS.
 *
 * @param {object} selectors CSS selectors to potentially modify
 * @param {object} userRules user rules to apply
 * @returns {string} CSS data with the given rules applied
 */
const applyRemoveSelectors = (selectors, userRules) => {
  // For each rule...
  for(let u = 0; u < userRules.length; u++) {
    // ...Iterate through the selectors and remove any selectors that match the rule.
    // This ensures that we remove the longest items first.
    for(let s = 0; s < selectors.length; s++) {
      if(selectors[s].indexOf(userRules[u].value) != -1) {
        /*
         * If remove rule contains a space we need to add a space at the position it was removed
         * from. For example, removing ".foo .bar" from CSS "div.foo .bar.b { ... }", if we did NOT
         * add a space we would incorrectly get "div.b { ... }" instead of "div .b { ... }".
         */
        const replacement = userRules[u].value.indexOf(" ") != -1 ? " ": "";
        selectors[s] = selectors[s].replace(userRules[u].value, replacement).trim();
        selectors[s] = selectors[s].replace(/\s{2,}/, " ");
        if(selectors[s].length == 0) {
          selectors.splice(s, 1);
          s--;
          // If we remove element 0 then i will be -1, which means the loop will execute with
          // selectors[-1]. Instead set it to 0 so the loop will fail the "i < selectors.length" check.
          if(s < 0) {
            s = 0;
          }
          if(selectors.length == 0) {
            break;
          }
        }
      }
    }
  }
  return selectors;
}

module.exports = { applyRules };
