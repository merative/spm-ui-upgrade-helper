#!/usr/bin/env node

const fs = require("fs-extra");
const yaml = require("js-yaml");
const { dryRunShellJs } = require("../shared-utils/sharedUtils").dummyShells;
const dockerTasks = require("./docker-tasks");

process.argv.splice(0, 2); // Remove node and script name

// Strip out "-n/--dry-run" argument if present
let dryRun = false;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === "-n" || process.argv[i] === "--dry-run") {
    dryRun = true;
    process.argv.splice(i, 1);
    i--;
    continue;
  }
}
const shell = dryRun ? dryRunShellJs : undefined;

if (dryRun) {
  console.log("");
}

let file, props;
try {
  file = fs.readFileSync(".docker-tasks.yml", "utf8");
  props = yaml.load(file);
} catch (e) {
  console.log(
    "ERROR: Could not read file .docker-tasks.yml."
  );
  return 1;
}

const r = dockerTasks(shell, props, process.argv);

if (dryRun) {
  console.log("");
}

process.exit(r);
