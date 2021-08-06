const utils = require("../shared-utils/sharedUtils");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = utils.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`icon-replacer-tool test (from: packages/icon-replacer-tool/${folder})`, () => {
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
    inputFolder,
    outputFolder: temporaryFolder,
    globs: [ "**" ],
    iconMappings: "./icon_mappings.json",
    iconFolder: "./source_files",
    quiet: true,
    testMode: true,
  };

  const testFunc = () => { execute(overrides); };

  utils.testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
