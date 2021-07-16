const { createGitRepo, commitFiles } = require("./gitUtils");
const { removeOutputFolder, globAllFiles, copyFilesToOutputFolder, flipToOutputFiles } = require("./filesAndFolders");
const { removeIgnoredFiles } = require("./removeIgnoredFiles");

/**
 * The init step will create a git repo in the output folder, glob up the input files, remove any
 * ignored files, copy the remaining files to the output folder and commit them, then add the
 * file paths to the config object
 *
 * Tools should call the following code when they start:
 * ```
 *     const config = { ...utils.loadConfig(), ...overrides };
 *     utils.init(config);
 * ```
 * This means when a tool is run independently it will set up the output folder itself and glob the
 * files etc.
 *
 * When the main tool calls a tool it passes `{ skipInit: true, files }` as an override meaning the
 * `init` step is skipped. We don't want each tool deleting and recreating the output folder or to
 * have to glob the list of files over and over.
 *
 * @param {*} config configuration object
 */
const init = config => {
  if(config.skipInit) {
    console.log("Skipping init step");
    return;
  }

  console.log("Initializing output folder");
  removeOutputFolder(config);
  createGitRepo(config);
  let inputFiles = globAllFiles(config);
  inputFiles = removeIgnoredFiles(config, inputFiles);
  copyFilesToOutputFolder(config, inputFiles);
  commitFiles(config.outputFolder, "Initial commit");
  const files = flipToOutputFiles(config, inputFiles);
  config.files = files;
}

module.exports = { init };
