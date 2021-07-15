const testWithDataFolder = require("test-with-data-folder");
const { execute } = require("./index");

const testToolOverrides = [
  {
    "package": "service-main",
    "name": "Run SPM UI Upgrade Helper",
    "port": 4000,
    "commandName": "extension.runUIUpgradeHelperMain",
    "enabled": true
  },
  {
    "package": "service-main/test-data/fake-tool-1",
    "name": "Run SPM UI Upgrade Helper - Fake Tool 1",
    "port": 4001,
    "commandName": "extension.runUIUpgradeHelperFakeTool1",
    "enabled": true
  },
  {
    "package": "service-main/test-data/fake-tool-2-disabled",
    "name": "Run SPM UI Upgrade Helper - Fake Tool 2",
    "port": 4002,
    "commandName": "extension.runUIUpgradeHelperFakeTool2",
    "enabled": false
  },
  {
    "package": "service-main/test-data/fake-tool-3",
    "name": "Run SPM UI Upgrade Helper - Fake Tool 3",
    "port": 4003,
    "commandName": "extension.runUIUpgradeHelperFakeTool3",
    "enabled": true
  }
];

const inputFolder = "./test-data/test-case-1/input";
const expectedFolder = "./test-data/test-case-1/expected";
const temporaryFolder = "./test-data/test-case-1/temp";
const testConfigOverrides = {
  inputFolder,
  outputFolder: temporaryFolder,
};

test('service-main index test', () => {
  const testFunc = () => { execute(testConfigOverrides, testToolOverrides); };
  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
});
