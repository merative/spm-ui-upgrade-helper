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
    cssRulesTool: {
      rulesFolder: "../css-rules-tool/rules",
      rulesFolderAdditional: "/home/workspace/rules",
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
    },
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
    cssRulesTool: {
      rulesFolder: "ccc",
      rulesFolderAdditional: "ddd",
    },
    iconReplacerTool: {
      exclude: "ggg",
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
    },
  }
  const expected = overrides;

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});

test('config test with some overrides', () => {
  const overrides = {
    ignorePatternsFile: "eee",
    quiet: true,
    cssRulesTool: {
      rulesFolder: "ccc",
      rulesFolderAdditional: "ddd",
    },
  }
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    ignorePatternsFile: "eee",
    quiet: true,
    debug: true,
    skipInit: false,
    files: [],
    cssRulesTool: {
      rulesFolder: "ccc",
      rulesFolderAdditional: "ddd",
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
    },
  };

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});
