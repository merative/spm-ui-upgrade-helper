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

// this works 👇

// const config = utils.loadConfig();
// iconReplacer.run(
//   "/Users/jonathan/Code/SPM/70110-Master/streams/TI",
//   "/Users/jonathan/Code/spm-ui-upgrade-helper/packages/icon-replacer/source_files",
//   "/Users/jonathan/Code/spm-ui-upgrade-helper/packages/icon-replacer/icon_mappings.json",
//   config.iconReferenceExclude,
//   config.verbose
// );

module.exports = { execute };
