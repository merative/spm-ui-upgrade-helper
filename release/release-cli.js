const shelljs = require("shelljs");
const dryRunShellJs = require("./tests/dryRunShellJs");
const release = require("./release-local");

const option = process.argv[2];
const version = process.argv[3];
const dryRun = process.argv[4] === "-n" || process.argv[4] === "--dry-run";

if(!option || !version) {
  console.log("ERROR: You must supply options and version as params");
  console.log("Usage: yarn release --start/--ship <version> [-n/--dry-run]");
  console.log("Example: yarn release --start 0.0.1");
  return 1;
}

const shell = dryRun ? dryRunShellJs : shelljs;

return release(shell, option, version);
