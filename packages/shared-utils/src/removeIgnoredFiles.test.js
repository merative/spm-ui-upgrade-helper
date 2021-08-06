const utils = require("../sharedUtils");
const { loadConfig } = require("./config");
const { removeIgnoredFiles } = require("./removeIgnoredFiles");

let info = console.info;
beforeEach(() => {
  console.info = () => {};
});

afterEach(() => {
  console.info = info;
});

const overrides = {
  inputFolder: "src/test-data/removeIgnoredFiles/input",
  outputFolder: "src/test-data/removeIgnoredFiles/output",
}

test('removeIgnoredFiles test 1', () => {
    const config = loadConfig(overrides);
    let inputFiles = utils.glob(overrides.inputFolder + "/**");
    inputFiles = inputFiles.map(f => {
      return f.startsWith("./") ? f.substring(2) : f;
    });
    const expected = [
      "src/test-data/removeIgnoredFiles/input/bbb/bar.txt",
      "src/test-data/removeIgnoredFiles/input/bbb/foo.txt",
    ];

    const actual = removeIgnoredFiles(config, inputFiles);

    expect(actual).toEqual(expected);
});
