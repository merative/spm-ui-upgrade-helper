const iconReplacer = require("./src/icon-replacer");
const utils = require("../shared-utils/sharedUtils");

const iconFolder = "/home/theia/packages/icon-replacer/source_files";
const iconMappings = "/home/theia/packages/icon-replacer/icon_mappings.json";

const execute = () => {
  // Initial setup
  const config = utils.loadConfig();
  utils.removeOutputFolder(config);
  utils.createGitRepo(config);
  const targetFiles = utils.addTargetFiles(config);
  utils.commitFiles(config.outputFolder, "feat(*): initial commit");

  iconReplacer.run(
    config.outputFolder,
    iconFolder,
    iconMappings,
    config.iconReferenceExclude,
    config.verbose
  );
};

module.exports = { execute };
