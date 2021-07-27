/**
 * Load the configuration. Note that paths are either absolute paths within the docker container, or
 * else relative paths from the perspective of `packages/main-tool`.
 *
 * @param {*} overrides override folder locations for testing purposes
 * @returns {object} the configuration data
 */
const loadConfig = (overrides = {}) => {
  const config = {
    inputFolder: overrides.inputFolder || "/home/workspace/input",
    outputFolder: overrides.outputFolder || "/home/workspace/output",
    ignorePatternsFile: overrides.ignorePatternsFile || "../../config/.spm-uiuh-ignore",

    quiet: overrides.quiet || false,
    debug: overrides.debug === false ? false : true,
    skipInit: overrides.skipInit || false,
    files: overrides.files || [],

    // FIXME Move the files into css-rules-tool since they are not shared
    cssRulesTool: {
      rulesFolder: overrides.cssRulesTool && overrides.cssRulesTool.rulesFolder || "../../config/rules",
      rulesFolderAdditional: overrides.cssRulesTool && overrides.cssRulesTool.rulesFolderAdditional || "/home/workspace/rules",
    },

    iconReplacerToolExclude: overrides.iconReplacerToolExclude || ["zip", "class", "jpg", "jpeg", "gif", "png"],

    windowSizeToolRules: overrides.windowSizeToolRules || "../window-size-tool/rules.json",
  };
  return config;
}

module.exports = { loadConfig };
