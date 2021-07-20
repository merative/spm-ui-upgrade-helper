const shell = require("shelljs");

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
 * Commits all files in the given folder to the Git repository.
 *
 * @param {string} folder folder containing the Git repository
 * @param {string} message commit message
 */
const commitFiles = (folder, message) => {
  const startTime = new Date().getTime();
  console.info("Committing files");
  const cwd = process.cwd();
  shell.cd(folder);
  shell.exec(`git add .`);
  shell.exec(`git commit --quiet --message "${message}"`);
  shell.cd(cwd);
  const endTime = new Date().getTime();
  console.info(`Finished committing files [${Math.ceil((endTime-startTime)/60000)} minutes]`);
};

module.exports = {
  createGitRepo,
  commitFiles,
};
