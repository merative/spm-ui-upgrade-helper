const fileio = require("@folkforms/file-io");
const testWithDataFolder = require("test-with-data-folder");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = fileio.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
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
    quiet: true,
    debug: false,
    testMode: true,
  };

  const testFunc = () => { execute(testConfigOverrides); };

  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
