const { loadConfig } = require("./src/config");
const { loadRules } = require("./src/rulesUtils");
const { removeInvalidCSS, restoreInvalidCSS } = require("./src/invalidCss");
const { createGitRepo, commitFiles } = require("./src/gitUtils");
const { identicalData } = require("./src/identicalData");
const {
  removeOutputFolder,
  writeFilesToDisk,
  globAllFiles,
  filterFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles
} = require("./src/filesAndFolders");
const { removeIgnoredFiles } = require("./src/removeIgnoredFiles");

module.exports = {
  // config.js
  loadConfig,
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
  writeFilesToDisk,
  globAllFiles,
  filterFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
  // removeIgnoredFiles.js
  removeIgnoredFiles,
};
