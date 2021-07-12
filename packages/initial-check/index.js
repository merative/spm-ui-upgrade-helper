const fs = require("fs-extra");
const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");

const execute = overrides => {
  const config = { ...utils.loadConfig(), ...overrides };

  // Test that the output folder is writeable
  try {
    const testFile = `${config.outputFolder}/.test.txt`;
    console.log(`Check 1: Writing a test file '${testFile}' to ensure output folder is writeable`);
    const testData = [ "foo" ];
    fileio.writeLines(testFile, testData);
    fs.removeSync(testFile);
  } catch(err) {
    console.log(`ERROR: Could not write test file to output folder. You may need to run \`chmod -R 777 <output folder>\` on the local machine.`);
    throw err;
  }

  console.log("Initial check successful");
}

module.exports = { execute };
