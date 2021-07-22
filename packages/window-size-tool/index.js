const config2 = require("./config");
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

  // const inputFiles = utils2.readUIMFiles(config.inputFolder); // get UIM files from target directory
  const inputFiles = utils.keepFiles(config.files, "uim", "vim");
  const rules = fileio.readJson(config2.rulesFile); // get rules objects

  let outputFiles = {};

  inputFiles.forEach(file => {
    const contents = fileio.readLines(file).join("\n");
    const document = parser.parseFromString(contents);

    const outputDocument = engine.applyRules(document, file, rules, config2.sizes); // generate output files based on rules

    // FIXME Check if there were actually changes
    outputFiles[file] = serializer.serializeToString(outputDocument);
  });

  // utils2.writeUIMFiles(config.outputFolder, outputFiles); // write transformed files to target directory
  utils.writeFilesToDisk(config, outputFiles);

  console.info("window-size-tool finished");
};

module.exports = { execute };
