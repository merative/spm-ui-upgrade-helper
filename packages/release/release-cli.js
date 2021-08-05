const shelljs = require("shelljs");
const { dryRunShellJs } = require("dummy-shells");
const { Command } = require('commander');
const release = require("./release-local");

const program = new Command();
program
  .name("yarn release")
  .usage("--start/--ship <version>")
  .addHelpText('beforeAll', 'Create a release for testing, or ship the current release.\n')
  .option('--start <version>', 'Start the release process by creating and pushing the release branch and building a docker image')
  .option('--ship <version>', 'Ship the release by pushing the latest docker image to the repo and tagging the current commit')
  .option('-n, --dry-run', 'Show what commands would be executed, without actually running anything')
  .parse(process.argv);

const opts = program.opts();
const start = opts.start;
const ship = opts.ship;
const dryRun = opts.dryRun;

if(!start && !ship) {
  program.help();
}

let option, version;
if(start) { option = "--start"; version = start; }
if(ship) { option = "--ship"; version = ship; }

const shell = dryRun ? dryRunShellJs : shelljs;
dryRunShellJs._setExecStdOut("");

return release(shell, option, version);
