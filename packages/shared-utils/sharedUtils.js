const { loadConfig } = require("./src/config");
const { loadRules } = require("./src/rulesUtils");
const { removeInvalidCSS, restoreInvalidCSS } = require("./src/invalidCss");
const { removeOutputFolder, createGitRepo, addTargetFiles, commitFiles } = require("./src/gitUtils");
const { identicalData } = require("./src/identicalData");
const { writeFilesToDisk, globAllFiles, filterFiles, copyFilesToOutputFolder } = require("./src/filesAndFolders");
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
  removeOutputFolder,
  createGitRepo,
  addTargetFiles,
  commitFiles,
  // identicalData.js
  identicalData,
  // filesAndFolders.js
  writeFilesToDisk,
  globAllFiles,
  filterFiles,
  copyFilesToOutputFolder,
  // removeIgnoredFiles.js
  removeIgnoredFiles,
};
