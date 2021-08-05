const shelljs = require("shelljs");
const { dryRunShellJs } = require("dummy-shells");
const { Command } = require('commander');
const gatsbyConditionalDeploy = require("./gatsby-conditional-deploy");

const program = new Command();
program
  .name("yarn gatsby-conditional-deploy")
  .addHelpText('beforeAll', 'Deploy Gatsby only if there are changes in the "docs" folder or to "packages/gatsby-docs/src/data/nav-items.yaml".\n')
  .option('-n, --dry-run', 'Show what commands would be executed, without actually running anything')
  .parse(process.argv);

const shell = program.opts().dryRun ? dryRunShellJs : shelljs;

const travisBranch = process.env.TRAVIS_BRANCH;
if(travisBranch !== "main") {
  console.info("Not checking for documentation changes since branch was not main");
  return 0;
}

/*
 * We are currently on main, and we want to get all changes on the feature branch which is being
 * merged into main. This is so we can check for changes that will trigger a gatsby deploy. What we
 * have is a merge commit with two parents that can be referenced as head^1 and head^2. The latter
 * is the last commit of the feature branch just before the merge. We can diff that commit with the
 * merge-base (the merge-base being the point where the feature branch diverged from main) to get
 * all the changes on the feature branch.
 */
const mergeBase = shell.exec(`git merge-base HEAD^1 HEAD^2`).stdout.trimEnd();
const changes = shell.exec(`git diff --name-only ${mergeBase} HEAD^2`).stdout.split("\n");

return gatsbyConditionalDeploy(shell, changes);
