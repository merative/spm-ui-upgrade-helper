const { createGitRepo, commitFiles } = require("./gitUtils");
const { removeOutputFolder, globAllFiles, copyFilesToOutputFolder, flipToOutputFiles } = require("./filesAndFolders");
const { removeIgnoredFiles } = require("./removeIgnoredFiles");

/**
 * The init step will wipe the output folder, create a git repo, glob up the input files, remove any
 * ignored files from the list, copy the files to the output folder, commit them, then add the
 * resulting file paths to the config object
 *
 * Tools MUST call the following code in their `execute` method:
 * ```
 * const execute = overrides => {
 *   const config = { ...utils.loadConfig(), ...overrides };
 *   utils.init(config);
 * ```
 * This way when a tool is run independently it will do all the setup itself, but when it is called
 * via the main tool the `init` code will be skipped, because the main tool has done it already.
 *
 * @param {*} config configuration object
 */
const init = config => {
  if(config.logLevel.toLowerCase() === "quiet") {
    console.info = () => {};
    console.log = () => {};
    console.debug = () => {};
  }

  if(config.logLevel.toLowerCase() === "normal") {
    console.debug = () => {};
  }

  // Skip init sometimes (used when tools are run via the main tool, and during tests)
  if(config.internal.skipInit) {
    console.info("Skipping init step");
    return;
  }

  // Remove "./" paths as they will cause problems later when trying to ignore files
  config.internal.inputFolder = config.internal.inputFolder.startsWith("./")
    ? config.internal.inputFolder.substring(2)
    : config.internal.inputFolder;
  config.internal.outputFolder = config.internal.outputFolder.startsWith("./")
    ? config.internal.outputFolder.substring(2)
    : config.internal.outputFolder;

  console.info("Initializing output folder");
  removeOutputFolder(config);
  if(!config.internal.testMode) {
    createGitRepo(config);
  }
  let inputFiles = globAllFiles(config);
  inputFiles = removeIgnoredFiles(config, inputFiles);
  copyFilesToOutputFolder(config, inputFiles);
  if(!config.internal.testMode) {
    commitFiles(config.internal.outputFolder, "Initial commit");
  }
  let files = flipToOutputFiles(config, inputFiles);
  config.internal.files = files;
}

module.exports = { init };
