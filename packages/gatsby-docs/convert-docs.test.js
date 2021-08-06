const utils = require("../shared-utils/sharedUtils");
const convertDocs = require("./convert-docs");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = utils.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`convert-docs test (from: packages/gatsby-docs/${folder})`, () => {
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
  const overrides = {
    docsFolder: temporaryFolder,
    outputFolder: temporaryFolder,
    skipCopy: true,
  };
  const testFunc = () => { convertDocs(overrides); };

  utils.testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
