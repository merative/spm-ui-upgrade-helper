const shell = require("shelljs");

/**
 * Creates a Git repository in `config.internal.outputFolder`.
 *
 * @param {object} config configuration object
 */
const createGitRepo = config => {
  const cwd = process.cwd();
  shell.cd(config.internal.outputFolder);
  shell.exec(`git init`);
  shell.exec(`git config gc.auto 0`);
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
  console.info(`Committing files finished [${Math.ceil((endTime-startTime)/1000)} seconds]`);
};

module.exports = {
  createGitRepo,
  commitFiles,
};
