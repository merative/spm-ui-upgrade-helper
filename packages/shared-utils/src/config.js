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
    ignorePatternsFile: overrides.ignorePatternsFile || "../../config/.spm-uiuh-ignore",
    iconReplacerExclude: overrides.iconReplacerExclude || ["zip", "class", "jpg", "jpeg", "gif", "png"],
    quiet: overrides.quiet || false,
    debug: overrides.debug === false ? false : true,
    skipInit: overrides.skipInit || false,
    files: overrides.files || [],
  };
  return config;
}

module.exports = { loadConfig };
