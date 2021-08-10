const filesAndFolders = require("./filesAndFolders");
const fs = require("fs-extra");
const ignore = require("ignore");
const path = require('path');

const removeIgnoredFiles = (config, inputFiles) => {
  let startTime = new Date().getTime();
  const countBeforeIgnore = inputFiles.length;

  let relativePaths = inputFiles.map(f => path.relative(config.internal.inputFolder, f));
  relativePaths = relativePaths.map(f => f.replace(/\\/g, "/"));

  const ignoreFileOOTBContents = filesAndFolders.readLines(config.internal.ignorePatternsFile);
  const ignoreFileCustomer = `${config.internal.inputFolder}/.spm-uiuh-ignore`;
  const ignoreFileCustomerContents = fs.existsSync(ignoreFileCustomer)
    ? filesAndFolders.readLines(ignoreFileCustomer)
    : [];
  const allIgnores = [ ignoreFileOOTBContents, ignoreFileCustomerContents ].flat();

  const ig = ignore().add(allIgnores);
  relativePaths = ig.filter(relativePaths);

  const absolutePaths = relativePaths.map(f => `${config.internal.inputFolder}/${f}`);

  const countAfterIgnore = absolutePaths.length;
  let endTime = new Date().getTime();
  console.info(`Ignored ${countBeforeIgnore - countAfterIgnore} files [${endTime - startTime} ms]`);

  return absolutePaths;
}

module.exports = { removeIgnoredFiles };
