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
    // Globs will have `inputFolder` prepended, i.e. `${inputFolder}/${glob}`
    globs: overrides.globs || [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    ignorePatternsFile: overrides.ignorePatternsFile || "../../config/.spm-uiuh-ignore",
    quiet: overrides.quiet || false,
    debug: overrides.debug === false ? false : true,
    skipInit: overrides.skipInit || false,
    files: overrides.files || [],
    cssRulesTool: {
      rulesFolder: overrides.cssRulesTool && overrides.cssRulesTool.rulesFolder || "../css-rules-tool/rules",
      rulesFolderAdditional: overrides.cssRulesTool && overrides.cssRulesTool.rulesFolderAdditional || "/home/workspace/rules",
    },
    iconReplacerTool: {
      exclude: overrides.iconReplacerTool && overrides.iconReplacerTool.exclude || ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    windowSizeTool: {
      rules: overrides.windowSizeTool && overrides.windowSizeTool.rules || "../window-size-tool/rules.json",
    },
  };
  return config;
}

module.exports = { loadConfig };
