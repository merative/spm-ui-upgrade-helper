// const fileio = require("@folkforms/file-io");
// const { loadConfig } = require("./config");
// const { createGitRepo, commitFiles } = require("./gitUtils");

// beforeEach(() => {
//   const config = loadConfig({ outputFolder: "src/test-data/gitUtils/addTargetFiles/output" });
//   removeOutputFolder(config);
// })

// afterEach(() => {
//   const config = loadConfig({ outputFolder: "src/test-data/gitUtils/addTargetFiles/output" });
//   removeOutputFolder(config);
// })

// const overrides = {
//   inputFolder: "src/test-data/gitUtils/addTargetFiles/input",
//   outputFolder: "src/test-data/gitUtils/addTargetFiles/output",
//   ignorePatternsFolder: "src/test-data/gitUtils/addTargetFiles/ignore",
//   ignorePatternsFolderAdditional: "src/test-data/gitUtils/addTargetFiles/ignoreAdditional",
// }

test('gitUtils.createGitRepo dummy test ', () => {
  expect(true).toEqual(true);
});

test('gitUtils.commitFiles dummy test ', () => {
  expect(true).toEqual(true);
});
