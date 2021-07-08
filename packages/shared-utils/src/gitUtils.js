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
 * extension(s). Copies all files if no extensions are provided. Files ignored via `config/ignore`
 * data will also be excluded.
 *
 * For example:
 * - `createGitRepo(config)` => Create git repo and copy all files
 * - `createGitRepo(config, "css")` => Create git repo and copy css files
 * - `createGitRepo(config, "css", "js", "java")` => Create git repo and copy css, js and java files
 *
 * @param {object} config configuration object
 * @param {string} ext files ending in the given extension(s) will be included in the repository, or
 * all files if falsy.
 */
const addTargetFiles = (config, ...ext) => {
  console.log("Collecting input files");
  const extensions = ext.length > 0 ? ext.map(item => `*.${item}`) : [ "*" ];
  let inputFiles = [];
  extensions.forEach(extension => {
    const f = fileio.glob(`${config.inputFolder}/**/${extension}`);
    inputFiles.push(f);
  });
  inputFiles = inputFiles.flat();
  const countBefore = inputFiles.length;
  console.log(`Found ${countBefore} files`);

  // Remove ignored files
  inputFiles = removeIgnoredFiles(config, inputFiles);
  const countAfter = inputFiles.length;
  console.log(`Ignored ${countBefore - countAfter} files`);

  // Copy the files
  console.log(`Copying ${inputFiles.length} files to output folder`);
  const outputFiles = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    const destFolder = destFile.substring(0, destFile.lastIndexOf('/'));
    shell.mkdir('-p', destFolder);
    shell.cp(file, destFile);
    outputFiles.push(destFile);
  });
  return outputFiles;
}


/**
 * Commits all files in the given folder to the Git repository.
 *
 * @param {string} folder folder containing the Git repository
 * @param {string} message commit message
 */
const commitFiles = (folder, message) => {
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
