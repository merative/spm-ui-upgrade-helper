const fileio = require("@folkforms/file-io");
const testWithDataFolder = require("test-with-data-folder");
const { execute } = require("./index");

const testCaseFolders = fileio.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`css-rules-tool test (from: packages/css-rules-tool/${folder})`, () => {
    runTest(folder);
  });
});

const runTest = folder => {
  // Define paths
  const inputFolder = `${folder}/input`;
  const expectedFolder = `${folder}/expected`;
  const temporaryFolder = `${folder}/temp`;
  const configOverrides = {
    inputFolder,
    outputFolder: temporaryFolder,
    globs: [ "**/*" ],
    quiet: true,
    skipInit: true,
  };

  // Define the function under test
  const testFunction = () => { execute(configOverrides); };

  // Run the test
  testWithDataFolder(testFunction, inputFolder, expectedFolder, temporaryFolder);
}
