const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");

/**
 * Main method. Will be called via http://localhost:4000/execute
 *
 * @param {*} testConfigOverrides used for testing
 * @param {*} testToolOverrides used for testing
 */
const execute = (testConfigOverrides = {}, testToolOverrides = []) => {
  try {
    // Initial setup
    const tools = testToolOverrides.length > 0 ? testToolOverrides : fileio.readJson("../../config/tools.json");
    const config = { ...utils.loadConfig(), ...testConfigOverrides };
    utils.removeOutputFolder(config);
    utils.createGitRepo(config);
    let inputFiles = utils.globAllFiles(config);
    inputFiles = utils.removeIgnoredFiles(config, inputFiles);
    utils.copyFilesToOutputFolder(config, inputFiles);
    utils.commitFiles(config.outputFolder, "Initial commit");
    const files = utils.flipToOutputFiles(config, inputFiles);
    const configOverrides = { skipSetup: true, files };

    tools.forEach(tool => {
      if(tool.package === "service-main") { return; } // Skip main tool

      if(tool.enabled) {
        console.log(`==== Running tool '${tool.package}' ====`);
        const toolIndexFile = require(`../${tool.package}/index`);
        toolIndexFile.execute(configOverrides);
      }
    });

  } catch (error) {
    console.log(error);
    return 1;
  }

  console.log("All done!");
}

module.exports = { execute };
