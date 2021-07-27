const windowSizeToolConfig = require("./config");
const engine = require("./src/engine");
const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");
const xmldom = require("xmldom");

/**
 * Main method. Will be called via http://localhost:40xx/execute.
 */
const execute = overrides => {
  const config = { ...utils.loadConfig(), ...overrides };
  utils.init(config);

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const inputFiles = utils.keepFiles(config.files, "uim", "vim");
  const rules = fileio.readJson(config.windowSizeTool.rules);

  let outputFiles = {};
  inputFiles.forEach(file => {
    const contents = fileio.readLines(file).join("\n");
    const originalDocument = parser.parseFromString(contents);

    const { document, hasChanges } = engine.applyRules(originalDocument, file, rules, windowSizeToolConfig.sizes);

    // Only mark the files as 'for writing' if the contents changed
    if(hasChanges) {
      outputFiles[file] = serializer.serializeToString(document);
    }
  });

  utils.writeFilesToDisk(config, outputFiles);

  console.info("window-size-tool finished");
};

module.exports = { execute };
