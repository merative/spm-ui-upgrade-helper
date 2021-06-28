const bulkImageUpdater = require("@spm/bulk-image-updater");
const utils = require("../shared-utils/sharedUtils");

const execute = () => {

  // Initial setup
  const config = utils.loadConfig();
  utils.removeOutputFolder(config);
  utils.createGitRepo(config);
  const targetFiles = utils.addTargetFiles(config, "java", "css", "js", "properties");
  utils.commitFiles(config.outputFolder, "feat(*): initial commit");

  // bulkImageUpdater.run(config.inputFolder, null, null);
  console.log("All done!");
}

module.exports = { execute };
