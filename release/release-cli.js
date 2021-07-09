const shell = require("shelljs");
const release = require("./release-local");

const option = process.argv[2];
const version = process.argv[3];

if(!option || !version) {
  console.log("FIXME Missing params");
  return 1;
}

return release(shell, option, version);
