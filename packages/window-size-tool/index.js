const sizes = require("./sizes");
const engine = require("./src/engine");
const utils = require("../shared-utils/sharedUtils");
const xmldom = require("xmldom");

const fileio = { readLines: utils.readLines };

/**
 * Main method. Will be called via http://localhost:40xx/execute.
 */
const execute = (overrides) => {
  const config = utils.loadConfig(overrides);
  utils.init(config);

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const inputFiles = utils.keepFiles(config.internal.files, "uim", "vim");
  const rules = utils.readJson(config.windowSizeTool.rules);

  console.log('config.windowSizeTool.usePixelWidths', config.windowSizeTool.usePixelWidths);

  const outputFiles = engine.applyRules(
    inputFiles,
    rules,
    sizes,
    fileio,
    parser,
    serializer,
    config.windowSizeTool.usePixelWidths,
  );

  utils.writeFiles(outputFiles);

  console.info("window-size-tool finished");
};

module.exports = { execute };
