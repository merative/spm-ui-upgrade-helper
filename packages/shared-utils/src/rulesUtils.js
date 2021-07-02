const fileio = require('@folkforms/file-io');

/**
 * Loads the rules files and merges and sorts them. Also loads any rules files found at the location
 * specified by the `ADDITIONAL_RULES` environment variable.
 */
const loadRules = config => {
  const rulesJson = [];

  const rulesFiles1 = fileio.glob(`${config.rulesFolder}/*.json`);
  rulesFiles1.forEach(file => rulesJson.push(readRulesFile(file)));

  const rulesFiles2 = fileio.glob(`${config.rulesFolderAdditional}/*.json`);
  if(rulesFiles2.length > 0) {
    console.log(`Found ${rulesFiles2.length} additional rules files: ${rulesFiles2}`);
  } else {
    console.log(`Found 0 additional rules files`);
  }
  rulesFiles2.forEach(file => rulesJson.push(readRulesFile(file)));

  return mergeAndSortRules(rulesJson);
}

/**
 * Reads a rules file. Validates that all selectors have the required fields.
 *
 * @param {*} filename filename to read
 */
const readRulesFile = filename => {
  const rules = fileio.readJson(filename);
  rules.SelectorRemove.forEach(item => {
    if (!item.value) {
      throw new Error(
        `Invalid rule: File ${filename} is missing 'value' attribute for SelectorRemove rule: ${JSON.stringify(item)}`
      );
    }
  });
  rules.SelectorReplace.forEach(item => {
    if (!item.value || !item.newValue) {
      throw new Error(
        `Invalid rule: File ${filename} is missing either 'value' and/or 'newValue' attribute for SelectorReplace rule: ${JSON.stringify(item)}`
      );
    }
  });
  return rules;
}

/**
 * Merge the given rules data into a single rules object and sort the rules as most-specific (i.e.
 * longest) first.
 *
 * @param {array} rulesJson array of objects each containing rules data to be merged and sorted
 * @returns {object} the merged rules files
 */
const mergeAndSortRules = rulesJson => {
  let rules = { SelectorRemove: [], SelectorReplace: [] };
  rulesJson.forEach(newRules => {
    newRules.SelectorRemove = newRules.SelectorRemove || [];
    newRules.SelectorReplace = newRules.SelectorReplace || [];
    rules = {
      SelectorRemove: [ ...rules.SelectorRemove, ...newRules.SelectorRemove ],
      SelectorReplace: [ ...rules.SelectorReplace, ...newRules.SelectorReplace ],
    };
  });

  // Remove duplicates
  rules.SelectorRemove = rules.SelectorRemove.filter((item, index, self) =>
    index === self.findIndex(otherItem => (
      item.value === otherItem.value
    ))
  );
  rules.SelectorReplace = rules.SelectorReplace.filter((item, index, self) =>
    index === self.findIndex(otherItem => (
      item.value === otherItem.value && item.newValue === otherItem.newValue
    ))
  );

  rules.SelectorRemove.sort((a,b) => { return b.value.length - a.value.length;});
  rules.SelectorReplace.sort((a,b) => { return b.value.length - a.value.length;});
  return rules;
}

module.exports = { loadRules, mergeAndSortRules };