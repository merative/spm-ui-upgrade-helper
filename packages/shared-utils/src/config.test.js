const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    ignorePatternsFile: "../../config/.spm-uiuh-ignore",
    quiet: false,
    debug: true,
    skipInit: false,
    files: [],
    rulesFolder: "../../config/rules",
    rulesFolderAdditional: "/home/workspace/rules",
    iconReplacerExclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    windowSizeToolRules: "../window-size-tool/rules.json",
  }

  const actual = loadConfig();

  expect(actual).toEqual(expected);
});

test('config test with all overrides', () => {
  const overrides = {
    inputFolder: "aaa",
    outputFolder: "bbb",
    ignorePatternsFile: "eee",
    quiet: true,
    debug: false,
    skipInit: true,
    files: [],
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    iconReplacerExclude: "ggg",
    windowSizeToolRules: "../window-size-tool/rules.json",
  }
  const expected = overrides;

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});

test('config test with some overrides', () => {
  const overrides = {
    ignorePatternsFile: "eee",
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    quiet: true,
  }
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    ignorePatternsFile: "eee",
    quiet: true,
    debug: true,
    skipInit: false,
    files: [],
    rulesFolder: "ccc",
    rulesFolderAdditional: "ddd",
    iconReplacerExclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    windowSizeToolRules: "../window-size-tool/rules.json",
  };

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});
