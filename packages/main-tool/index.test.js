const fs = require("fs-extra");
const fileio = require("@folkforms/file-io");
const testWithDataFolder = require("test-with-data-folder");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = fileio.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`main-tool test (from: ${folder})`, () => {
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
  const testToolsOverride = fileio.readJson(`${folder}/tools.json`);
  let testConfigOverrides = {
    inputFolder,
    outputFolder: temporaryFolder,
    quiet: true,
  };
  const additionalConfigOverridesFile = `${folder}/config.json`;
  if(fs.existsSync(additionalConfigOverridesFile)) {
    const testAdditionalConfigOverrides = fileio.readJson(additionalConfigOverridesFile);
    testConfigOverrides = { ...testConfigOverrides, ...testAdditionalConfigOverrides };
  }

  const testFunc = () => { execute(testConfigOverrides, testToolsOverride); };

  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
