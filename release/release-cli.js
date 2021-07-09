const shelljs = require("shelljs");
const dryRunShellJs = require("./tests/dryRunShellJs");
const { Command } = require('commander');
const release = require("./release-local");

const program = new Command();
program.name("yarn release");
program.usage("--start/--ship <version>");
program.addHelpText('beforeAll', 'Create a release for testing, or ship the current release.\n');
program.option('--start <version>', 'Start the release process by creating and pushing the release branch and building a docker image');
program.option('--ship <version>', 'Ship the release by pushing the latest docker image to the repo and tagging the current commit');
program.option('-n, --dry-run', 'Show what commands would be executed, without actually running anything');
program.parse(process.argv);

const opts = program.opts();
const start = opts.start;
const ship = opts.ship;
const dryRun = opts.dryRun;

if(!start && !ship) {
  program.help();
  // console.log("ERROR: You must supply an option and a version as params");
  // console.log("Usage: yarn release --start/--ship <version> [-n/--dry-run]");
  // console.log("Example: yarn release --start 0.0.1");
//  return 1;
}

let option, version;
if(start) { option = "--start"; version = start; }
if(ship) { option = "--ship"; version = ship; }

const shell = dryRun ? dryRunShellJs : shelljs;

return release(shell, option, version);
