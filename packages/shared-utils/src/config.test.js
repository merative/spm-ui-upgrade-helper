const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    logLevel: "normal",
    cssRulesTool: {
      rulesFolder: "../css-rules-tool/rules",
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
    },
    internal: {
      inputFolder: "/home/workspace/input",
      outputFolder: "/home/workspace/output",
      ignorePatternsFile: "../../config/.spm-uiuh-ignore",
      files: [],
      skipInit: false,
      testMode: false,
    },
  }

  const actual = loadConfig();

  expect(actual).toEqual(expected);
});

test('config test with all overrides', () => {
  const overrides = {
    globs: [ "Foo/**/*" ],
    logLevel: "quiet",
    cssRulesTool: {
      rulesFolder: "ccc",
    },
    iconReplacerTool: {
      exclude: "ggg",
    },
    windowSizeTool: {
      rules: "hhh",
    },
    internal: {
      inputFolder: "aaa",
      outputFolder: "bbb",
      ignorePatternsFile: "eee",
      files: [],
      skipInit: true,
      testMode: true,
    },
  }
  const expected = overrides;

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});

test('config test with some overrides', () => {
  const overrides = {
    logLevel: "quiet",
    cssRulesTool: {
      rulesFolder: "../some-rules-folder",
    },
    internal: {
      ignorePatternsFile: "eee",
      skipInit: true,
    },
  }
  const expected = {
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    logLevel: "quiet",
    cssRulesTool: {
      rulesFolder: "../some-rules-folder",
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
    },
    internal: {
      inputFolder: "/home/workspace/input",
      outputFolder: "/home/workspace/output",
      ignorePatternsFile: "eee",
      files: [],
      skipInit: true,
      testMode: false,
    },
  };

  const actual = loadConfig(overrides);

  expect(actual).toEqual(expected);
});
