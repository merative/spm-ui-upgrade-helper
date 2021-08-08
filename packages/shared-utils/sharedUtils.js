const { loadConfig, merge } = require("./src/config");
const { loadRules } = require("./src/rulesUtils");
const { removeInvalidCSS, restoreInvalidCSS } = require("./src/invalidCss");
const { createGitRepo, commitFiles } = require("./src/gitUtils");
const { identicalData } = require("./src/identicalData");
const {
  removeOutputFolder,
  writeFiles,
  globAllFiles,
  keepFiles,
  removeFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
  glob,
  readJson,
  readLines,
  writeLines,
  copyFolder,
} = require("./src/filesAndFolders");
const { removeIgnoredFiles } = require("./src/removeIgnoredFiles");
const { init } = require("./src/init");
const testWithDataFolder = require("./src/testWithDataFolder");
const dummyShells = require("./src/dummyShells");

module.exports = {
  // config.js
  loadConfig,
  merge,
  // rulesUtils.js
  loadRules,
  // invalidCss.js
  removeInvalidCSS,
  restoreInvalidCSS,
  // gitUtils.js
  createGitRepo,
  commitFiles,
  // identicalData.js
  identicalData,
  // filesAndFolders.js
  removeOutputFolder,
  writeFiles,
  globAllFiles,
  keepFiles,
  removeFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
  glob,
  readJson,
  readLines,
  writeLines,
  copyFolder,
  // removeIgnoredFiles.js
  removeIgnoredFiles,
  // init.js
  init,
  // testWithDataFolder.js
  testWithDataFolder,
  // dummyShells.js
  dummyShells,
};
