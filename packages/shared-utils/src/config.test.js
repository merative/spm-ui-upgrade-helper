const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    rulesFolder: "../../config/rules",
    rulesFolderAdditional: "/home/workspace/rules",
    ignorePatternsFolder: "../../config/ignore",
    ignorePatternsFolderAdditional: "/home/workspace/ignore",
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
    ignorePatternsFolder: "eee",
    ignorePatternsFolderAdditional: "fff",
  }
  const expected = overrides;

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});

test('config test with some overrides', () => {
  const overrides = {
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    ignorePatternsFolder: "eee",
    ignorePatternsFolderAdditional: "fff",
  }
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    ignorePatternsFolder: "eee",
    ignorePatternsFolderAdditional: "fff",
  };

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});