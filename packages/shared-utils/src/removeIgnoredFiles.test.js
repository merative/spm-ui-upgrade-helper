const fileio = require("@folkforms/file-io");
const { loadConfig } = require("./config");
const { removeIgnoredFiles } = require("./removeIgnoredFiles");

const overrides = {
  inputFolder: "./src/test-data/removeIgnoredFiles/input",
  outputFolder: "./src/test-data/removeIgnoredFiles/output",
  ignorePatternsFolder: "src/test-data/removeIgnoredFiles/ignore",
  ignorePatternsFolderAdditional: "src/test-data/removeIgnoredFiles/ignoreAdditional",
}

test('removeIgnoredFiles test 1', () => {
    const config = loadConfig(overrides);
    const inputFiles = fileio.glob(overrides.inputFolder + "/**");
    const expected = [
      "./src/test-data/removeIgnoredFiles/input/bbb/bar.txt",
      "./src/test-data/removeIgnoredFiles/input/bbb/foo.txt",
    ];

    const actual = removeIgnoredFiles(config, inputFiles);

    expect(actual).toEqual(expected);
});
