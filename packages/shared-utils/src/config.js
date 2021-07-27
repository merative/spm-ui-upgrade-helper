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

    // FIXME Rename to cssRulesToolFiles or similar
    // FIXME Move the files into css-rules-tool since they are not shared
    rulesFolder: overrides.rulesFolder || "../../config/rules",
    rulesFolderAdditional: overrides.rulesFolderAdditional || "/home/workspace/rules",

    // FIXME Rename to iconReplacerToolExclude
    iconReplacerExclude: overrides.iconReplacerExclude || ["zip", "class", "jpg", "jpeg", "gif", "png"],

    windowSizeToolRules: overrides.windowSizeToolRules || "../window-size-tool/rules.json",
  };
  return config;
}

module.exports = { loadConfig };
