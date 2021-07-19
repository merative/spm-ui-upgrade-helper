// const css = require('css');
const { splitRules } = require("./splitRules");

/**
 * Apply the given user rules to a JS file. Applies the user rules and returns the modified contents.
 *
 * @param {object} userRules user rules to apply
 * @param {string} contents file contents
 * @param {string} filename input file, only used for error messages
 * @returns {string} JS data with the given rules applied
 */
const applyRulesToJS = (contents, userRules, filename) => {
  contents = contents.map(line => {
    line = applyRemoveRulesToJS(line, userRules.SelectorRemove);
    line = applyReplaceRulesToJS(line, userRules.SelectorReplace);
    return line;
  })
  return contents;
}

/**
 * Applies the 'SelectorRemove' user rules to the given line of Javascript.
 *
 * @param {object} line line of text to potentially modify
 * @param {object} userRules user rules to apply
 * @returns {string} the input line with the given rules applied
 */
const applyRemoveRulesToJS = (line, userRules) => {
  const items = convertRulesToIndividualItems(userRules);
  for (let i = 0; i < items.length; i++) {
    const regex = new RegExp(`[\`'"]${items[i]}[\`'"]`);
    if (line.match(regex)) {
      console.log(`applyRemoveRulesToJS: Found rule: '${items[i]}' in line '${line}'`);
    }
  }
  return line;
}

const convertRulesToIndividualItems = userRules => {
  let output = [];
  for (let u = 0; u < userRules.length; u++) {
    const rule = userRules[u].value;
    const split = splitRules(rule);
    output.push(split);
  }
  output = output.flat();
  output = [...new Set(output)];
  return output.sort();
}

/**
 * Applies the 'SelectorRename' user rules to the given line of Javascript.
 *
 * @param {string} line line of text to potentially modify
 * @param {object} userRules user rules to apply
 * @returns {string} the input line with the given rules applied
 */
const applyReplaceRulesToJS = (line, userRules) => {
  for(let u = 0; u < userRules.length; u++) {
    if(line.indexOf(userRules[u].value) != -1) {
      console.log(`applyReplaceRulesToJS: Found rule: '${userRules[u].value}' in line '${line}'.`);
    }
  }
  return line;
}

module.exports = { applyRulesToJS };
