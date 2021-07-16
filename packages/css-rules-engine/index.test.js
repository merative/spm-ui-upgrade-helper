const testWithDataFolder = require("test-with-data-folder");
const { execute } = require("./index");

test('css-rules-engine test', () => {
  // Define paths
  const inputFolder = "./test-data/test-case-1/input";
  const expectedFolder = "./test-data/test-case-1/expected";
  const temporaryFolder = "./test-data/test-case-1/temp";
  const configOverrides = {
    inputFolder,
    outputFolder: temporaryFolder,
  };

  // Define the function under test
  const testFunction = () => { execute(configOverrides); };

  // Run the test
  testWithDataFolder(testFunction, inputFolder, expectedFolder, temporaryFolder);
});
