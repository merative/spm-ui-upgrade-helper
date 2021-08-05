const shelljs = require("shelljs");
const { dryRunShellJs } = require("dummy-shells");
const { Command } = require('commander');
const gatsbyDeploy = require("./gatsby-deploy");

const program = new Command();
program
  .name("yarn gatsby-deploy")
  .addHelpText('beforeAll', 'Deploy Gatsby only if there are changes in the "docs" folder or to "packages/gatsby-docs/src/data/nav-items.yaml".\n')
  .option('-n, --dry-run', 'Show what commands would be executed, without actually running anything')
  .parse(process.argv);

const travisBranch = process.env.TRAVIS_BRANCH;
console.log(`travisBranch = ${travisBranch}`);
const changes = shelljs.exec(`git diff --name-status HEAD ${travisBranch}`).stdout.split("\n");

const dryRun = program.opts().dryRun;
const shell = dryRun ? dryRunShellJs : shelljs;

return gatsbyDeploy(shell, changes);
