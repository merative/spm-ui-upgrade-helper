const dummyShellJs = require("./shells/dummyShellJs");
const dryRunShellJs = require("./shells/dryRunShellJs");
const failingShellJs = require("./shells/failingShellJs");

/**
 * Dummy and dry run versions of shelljs used for testing.
 */

module.exports = {
  dummyShellJs,
  dryRunShellJs,
  failingShellJs,
};
