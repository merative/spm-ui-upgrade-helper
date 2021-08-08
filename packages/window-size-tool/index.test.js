const utils = require("../shared-utils/sharedUtils");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = utils.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`window-size-tool test (from: packages/window-size-tool/${folder})`, () => {
    runTest(folder);
  });
});

/**
 * Runs a test using the test data from the given folder.
 */
const runTest = folder => {
  const inputFolder = `${folder}/input`;
  const expectedFolder = `${folder}/expected`;
  const temporaryFolder = `${folder}/temp`;
  let testConfigOverrides = {
    inputFolder,
    outputFolder: temporaryFolder,
    globs: [ "**/*" ],
    logLevel: "quiet",
    testMode: true,
  };

  const testFunc = () => { execute(testConfigOverrides); };

  utils.testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
