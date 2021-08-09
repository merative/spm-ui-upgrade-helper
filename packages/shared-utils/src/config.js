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
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    // Log verbosity. Options are quiet/normal/debug.
    logLevel: "normal",
    // css-rules-tool options
    cssRulesTool: {
      // Folder where CSS rules are located
      rulesFolder: "../css-rules-tool/rules",
    },
    // icon-replacer-tool options
    iconReplacerTool: {
      // File extensions to exclude when checking for icon references
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
      // Directory containing v8 icon files
      iconFolder: "/home/theia/packages/icon-replacer-tool/source_files",
      // File containing icon mappings from v7 to v8
      iconMappings: "/home/theia/packages/icon-replacer-tool/icon_mappings.json",
    },
    // window-size-tool options
    windowSizeTool: {
      // Window sizing rules
      rules: "../window-size-tool/rules.json",
    },
    // Internal variables that should not be overridden by clients
    internal: {
      // Input and output folders are relative from inside the Docker container
      inputFolder: "/home/workspace/input",
      outputFolder: "/home/workspace/output",
      // The files and folders in this file will be ignored by the tool
      ignorePatternsFile: "../../config/.spm-uiuh-ignore",
      // Working set of files
      files: [],
      // Used to skip initialization stage when a tool is run from the main tool
      skipInit: false,
      // Used to suppress certain functions during testing
      testMode: false,
    }
  };
  config = merge(config, overrides);
  // If there is a .spm-uiuh-config file present then load it as an override
  const localConfigOverride = checkForLocalConfigOverride(config.internal.inputFolder)
  config = merge(config, localConfigOverride);
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

/**
 * Deep merges two objects. Items in object 'b' take precedence.
 *
 * @param {object} a first object
 * @param {object} b second object
 */
const merge = (a, b) => {
  let output = Object.assign({}, a);
  if (isObject(a) && isObject(b)) {
    Object.keys(b).forEach(key => {
      if (isObject(b[key])) {
        if (!(key in a))
          Object.assign(output, { [key]: b[key] });
        else
          output[key] = merge(a[key], b[key]);
      } else {
        Object.assign(output, { [key]: b[key] });
      }
    });
  }
  return output;
}

/**
 * Checks if the item is an object.
 *
 * @param {*} item item to check
 */
const isObject = item => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

module.exports = { loadConfig };
