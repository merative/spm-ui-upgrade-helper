const fs = require("fs-extra");
const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");

const execute = overrides => {
  const config = { ...utils.loadConfig(), ...overrides };

  checkVersionNumber();
  checkOutputFolderIsWritable(config);

  console.log("Initial checks successful");
}

/**
 * Looks for a version number in ../../version.json just so we have a reference when using 'latest' versions.
 */
const checkVersionNumber = () => {
  try {
    const json = fileio.readJson("../../version.json");
    console.log(`Success: Found version number ${json.version}`);
  } catch(err) {
    console.log(`Warning: Version number not found (could not find version.json)`);
  }
}

/**
 * Tests that the output folder is writeable.
 *
 * @param {*} config configuration object containing output folder path
 */
const checkOutputFolderIsWritable = config => {
  const testFile = `${config.outputFolder}/.test.txt`;
  try {
    const testData = [ "foo" ];
    fileio.writeLines(testFile, testData);
    fs.removeSync(testFile);
  } catch(err) {
    console.log(`ERROR: Could not write test file to output folder. You may need to run \`chmod -R 777 <output folder>\` on the local machine.`);
    throw err;
  }
  console.log(`Success: Wrote a test file '${testFile}' to ensure output folder is writeable`);
}

module.exports = { execute };
