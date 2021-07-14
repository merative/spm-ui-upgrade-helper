const shell = require("shelljs");
const fileio = require('@folkforms/file-io');
const { removeIgnoredFiles } = require("./removeIgnoredFiles");

/**
 * Removes the folder `config.outputFolder`.
 *
 * @param {object} config configuration object
 */
const removeOutputFolder = config => {
  const cwd = process.cwd();
  shell.rm("-rf", `${config.outputFolder}/*`);
  shell.rm("-rf", `${config.outputFolder}/.git`);
  shell.mkdir('-p', config.outputFolder);
  shell.cd(cwd);
}

/**
 * Creates a Git repository in `config.outputFolder`.
 *
 * @param {object} config configuration object
 */
const createGitRepo = config => {
  const cwd = process.cwd();
  shell.cd(config.outputFolder);
  shell.exec(`git init`);
  shell.cd(cwd);
}

/**
 * Copies files from `config.inputFolder` to `config.outputFolder` if they match the given
 * extension(s). Copies all files if `ext` is falsy. Files ignored via `config/ignore`
 * data will always be excluded.
 *
 * For example:
 * - `createGitRepo(config)` => Create git repo and copy all files
 * - `createGitRepo(config, "css")` => Create git repo and copy css files
 * - `createGitRepo(config, "css", "js", "java")` => Create git repo and copy css, js and java files
 *
 * @param {object} config configuration object
 * @param {string} ext files ending in the given extension(s) will be included in the repository, or
 * all files will be included if `ext` is falsy.
 */
const addTargetFiles = (config, ...ext) => {
  console.log("Collecting input files");
  const extensions = ext.length > 0 ? ext.map(item => `.${item}`) : null;

  let startTime = new Date().getTime();
  let inputFiles = fileio.glob(`${config.inputFolder}/**/*`);
  let endTime = new Date().getTime();
  console.log(`(FIXME Remove this method) Initial search found ${inputFiles.length} files [${Math.ceil((endTime-startTime)/60000)} minutes]`);

  startTime = new Date().getTime();
  if(extensions) {
    inputFiles = inputFiles.filter(f => {
      for(let i = 0; i < extensions.length; i++) {
        if(f.endsWith(extensions[i])) {
          return true;
        }
      }
      return false;
    });
  }
  endTime = new Date().getTime();
  console.log(`Filtered down to ${inputFiles.length} files based on extensions: ${ext} [${endTime - startTime} ms]`);

  startTime = new Date().getTime();
  inputFiles = inputFiles.sort();
  endTime = new Date().getTime();
  console.log(`Sorted the files [${endTime - startTime} ms]`);

  // Remove ignored files
  const countBeforeIgnore = inputFiles.length;
  startTime = new Date().getTime();
  inputFiles = removeIgnoredFiles(config, inputFiles);
  endTime = new Date().getTime();
  const countAfterIgnore = inputFiles.length;
  console.log(`Ignored ${countBeforeIgnore - countAfterIgnore} files [${endTime - startTime} ms]`);

  // Copy the files
  console.log(`Copying final list of ${inputFiles.length} files to output folder`);
  startTime = new Date().getTime();
  const outputFiles = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    const destFolder = destFile.substring(0, destFile.lastIndexOf('/'));
    shell.mkdir('-p', destFolder);
    shell.cp(file, destFile);
    outputFiles.push(destFile);
  });
  endTime = new Date().getTime();
  console.log(`Finished copying [${endTime - startTime} ms]`);
  return outputFiles;
}

/**
 * Commits all files in the given folder to the Git repository.
 *
 * @param {string} folder folder containing the Git repository
 * @param {string} message commit message
 */
const commitFiles = (folder, message) => {
  console.log("Committing files");
  const cwd = process.cwd();
  shell.cd(folder);
  shell.exec(`git add .`);
  shell.exec(`git commit --quiet --message "${message}"`);
  shell.cd(cwd);
};

module.exports = {
  removeOutputFolder,
  createGitRepo,
  addTargetFiles,
  commitFiles,
};
