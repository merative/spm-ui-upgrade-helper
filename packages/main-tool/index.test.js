const fs = require("fs-extra");
const utils = require("../shared-utils/sharedUtils");
const { execute } = require("./index");

/**
 * Run the test against each of the test case folders.
 */
const testCaseFolders = utils.glob("test-data/test-case-*", { onlyDirectories: true, deep: 1 });
testCaseFolders.forEach(folder => {
  test(`main-tool test (from: packages/main-tool/${folder})`, () => {
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
  const testToolsOverride = utils.readJson(`${folder}/tools.json`);
  let testConfigOverrides = {
    globs: [ "**/*" ],
    logLevel: "quiet",
    iconReplacerTool: {
      iconMappings: "../icon-replacer-tool/icon_mappings.json",
      iconFolder: "../icon-replacer-tool/source_files",
    },
    internal: {
      inputFolder,
      outputFolder: temporaryFolder,
      testMode: true,
    },
  };
  const additionalConfigOverridesFile = `${folder}/config.json`;
  if(fs.existsSync(additionalConfigOverridesFile)) {
    const testAdditionalConfigOverrides = utils.readJson(additionalConfigOverridesFile);
    testConfigOverrides = {
      ...testConfigOverrides,
      ...testAdditionalConfigOverrides,
      internal: {
        ...testConfigOverrides.internal,
        ...testAdditionalConfigOverrides.internal,
      },
    };
  }

  const testFunc = () => { execute(testConfigOverrides, testToolsOverride); };

  utils.testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
}
