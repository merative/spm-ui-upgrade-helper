const fs = require("fs-extra");
const filesAndFolders = require("./filesAndFolders");

/**
 * Load the configuration. Note that paths are either absolute paths within the docker container or
 * else relative paths from the perspective of `packages/main-tool`.
 *
 * @param {*} overrides override folder locations for testing purposes
 * @returns {object} the configuration data
 */
const loadConfig = (overrides = {}) => {
  let config = {
    // Globs are relative to the input folder, i.e. `${inputFolder}/${glob}`
    globs: overrides.globs || [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    // Log verbosity. Options are quiet/normal/debug.
    logLevel: overrides.logLevel || "normal",
    // css-rules-tool options
    cssRulesTool: {
      // Folder where CSS rules are located
      rulesFolder: overrides.cssRulesTool && overrides.cssRulesTool.rulesFolder || "../css-rules-tool/rules",
    },
    // icon-replacer-tool options
    iconReplacerTool: {
      // File extensions to exclude when checking for icon references
      exclude: overrides.iconReplacerTool && overrides.iconReplacerTool.exclude || ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    // window-size-tool options
    windowSizeTool: {
      // Window sizing rules
      rules: overrides.windowSizeTool && overrides.windowSizeTool.rules || "../window-size-tool/rules.json",
    },
    // Internal variables that should not be overridden by clients
    internal: {
      // Input and output folders are relative from inside the Docker container
      inputFolder: overrides.internal && overrides.internal.inputFolder || "/home/workspace/input",
      outputFolder: overrides.internal && overrides.internal.outputFolder || "/home/workspace/output",
      // The files and folders in this file will be ignored by the tool
      ignorePatternsFile: overrides.internal && overrides.internal.ignorePatternsFile || "../../config/.spm-uiuh-ignore",
      // Working set of files
      files: overrides.internal && overrides.internal.files || [],
      // Used to skip initialization stage when a tool is run from the main tool
      skipInit: overrides.internal && overrides.internal.skipInit || false,
      // Used to suppress certain functions during testing
      testMode: overrides.internal && overrides.internal.testMode || false,
    }
  };
  // If there is a .spm-uiuh-config file present then load it as an override
  const configOverride = checkForLocalConfigOverride(config.internal.inputFolder)
  config = { ...config, ...configOverride };
  return config;
}

/**
 * Check for an `inputFolder/.spm-uiuh-config` file. This file can be used by customers to override
 * the configuration. It should be a JSON file with the same structure as above.
 *
 * @param {string} inputFolder input folder
 */
const checkForLocalConfigOverride = inputFolder => {
  const file = `${inputFolder}/.spm-uiuh-config`;
  if(fs.existsSync(file)) {
    console.info("Found .spm-uiuh-config");
    return filesAndFolders.readJson(file);
  }
  return undefined;
}

module.exports = { loadConfig };
