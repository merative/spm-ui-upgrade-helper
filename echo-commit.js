/**
 * Echoes the current commit to a json file. Run before each Docker build for traceability.
 */
const shelljs = require("shelljs");
const commit = shelljs.exec("git rev-parse --short HEAD").trimEnd();
const commitLong = shelljs.exec("git rev-parse HEAD").trimEnd();
const r = shelljs.exec(`echo { "commit": "${commit}", "commitLong": "${commitLong}" }>commit.json`);
if(r.code != 0) { shelljs.exit(r.code); }
