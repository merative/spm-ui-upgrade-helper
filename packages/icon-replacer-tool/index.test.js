const testWithDataFolder = require("test-with-data-folder");
const fileio = require("@folkforms/file-io");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = fileio.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`icon-replacer-tool test (from: ${folder})`, () => {
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
  };

  const testFunc = () => { execute(overrides); };

  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
