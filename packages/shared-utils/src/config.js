const fileio = require('@folkforms/file-io');

/**
 * Load the configuration.
 *
 * @param {*} overrides override folder locations for testing purposes
 * @returns {object} the configuration data
 */
const loadConfig = (overrides = {}) => {
  const config = {
    inputFolder: overrides.inputFolder || "/home/workspace/input",
    outputFolder: overrides.outputFolder || "/home/workspace/output",
    rulesFolder: overrides.rulesFolder || "../../config/rules",
    rulesFolderAdditional: overrides.rulesFolderAdditional || "/home/workspace/rules",
    ignorePatternsFolder: overrides.ignorePatternsFolder || "../../config/ignore",
    ignorePatternsFolderAdditional: overrides.ignorePatternsFolderAdditional || "/home/workspace/ignore",
    iconReferenceExclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    verbose: true,
  };
  return config;
}

module.exports = { loadConfig };
