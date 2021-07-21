const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    rulesFolder: "../../config/rules",
    rulesFolderAdditional: "/home/workspace/rules",
    ignorePatternsFile: "../../config/.spm-uiuh-ignore",
    iconReplacerExclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    quiet: false,
    skipInit: false,
    files: [],
  }

  const actual = loadConfig();

  expect(actual).toEqual(expected);
});

test('config test with all overrides', () => {
  const overrides = {
    inputFolder: "aaa",
    outputFolder: "bbb",
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    ignorePatternsFile: "eee",
    iconReplacerExclude: "ggg",
    quiet: true,
    skipInit: true,
    files: [],
  }
  const expected = overrides;

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});

test('config test with some overrides', () => {
  const overrides = {
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    ignorePatternsFile: "eee",
    quiet: true,
  }
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    ignorePatternsFile: "eee",
    iconReplacerExclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    quiet: true,
    skipInit: false,
    files: [],
  };

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});
