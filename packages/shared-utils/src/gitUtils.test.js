const fileio = require("@folkforms/file-io");
const { loadConfig } = require("./config");
const { removeOutputFolder, createGitRepo, addTargetFiles, commitFiles } = require("./gitUtils");

beforeEach(() => {
  const config = loadConfig({ outputFolder: "src/test-data/gitUtils/addTargetFiles/output" });
  removeOutputFolder(config);
})

afterEach(() => {
  const config = loadConfig({ outputFolder: "src/test-data/gitUtils/addTargetFiles/output" });
  removeOutputFolder(config);
})

const overrides = {
  inputFolder: "src/test-data/gitUtils/addTargetFiles/input",
  outputFolder: "src/test-data/gitUtils/addTargetFiles/output",
  ignorePatternsFolder: "src/test-data/gitUtils/addTargetFiles/ignore",
  ignorePatternsFolderAdditional: "src/test-data/gitUtils/addTargetFiles/ignoreAdditional",
}

test('gitUtils test addTargetFiles with filter 1', () => {
  const config = loadConfig(overrides);

  addTargetFiles(config, "css");

  const actual = fileio.glob(`${overrides.outputFolder}/**`).sort();
  const expected = [ "src/test-data/gitUtils/addTargetFiles/output/foo.css" ];
  expect(actual).toEqual(expected);
});

test('gitUtils test addTargetFiles with filter 2', () => {
  const config = loadConfig(overrides);

  addTargetFiles(config, "css", "js");

  const actual = fileio.glob(`${overrides.outputFolder}/**`).sort();
  const expected = [
    "src/test-data/gitUtils/addTargetFiles/output/foo.css",
    "src/test-data/gitUtils/addTargetFiles/output/foo.js",
  ].sort();
  expect(actual).toEqual(expected);
});

test('gitUtils test addTargetFiles no filter', () => {
  const config = loadConfig(overrides);

  addTargetFiles(config);

  const actual = fileio.glob(`${overrides.outputFolder}/**`).sort();
  const expected = [
    "src/test-data/gitUtils/addTargetFiles/output/foo.css",
    "src/test-data/gitUtils/addTargetFiles/output/foo.js",
    "src/test-data/gitUtils/addTargetFiles/output/foo.java",
    "src/test-data/gitUtils/addTargetFiles/output/foo.properties",
  ].sort();
  expect(actual).toEqual(expected);
});
