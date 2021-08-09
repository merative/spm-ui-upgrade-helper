const sizes = require("./sizes");
const engine = require("./src/engine");
const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");
const xmldom = require("xmldom");

/**
 * Main method. Will be called via http://localhost:40xx/execute.
 */
const execute = (overrides) => {
  const config = { ...utils.loadConfig(), ...overrides };
  utils.init(config);

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const inputFiles = utils.keepFiles(config.files, "uim", "vim");
  const rules = fileio.readJson(config.windowSizeTool.rules);

  const outputFiles = engine.applyRules(inputFiles, rules, sizes, fileio, parser, serializer);

  utils.writeFiles(outputFiles);

  console.info("window-size-tool finished");
};

module.exports = { execute };
