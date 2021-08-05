const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    ignorePatternsFile: "../../config/.spm-uiuh-ignore",
    quiet: false,
    debug: true,
    testMode: false,
    skipInit: false,
    files: [],
    cssRulesTool: {
      rulesFolder: "../css-rules-tool/rules",
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
    globs: [ "Foo/**/*" ],
    ignorePatternsFile: "eee",
    quiet: true,
    debug: false,
    testMode: true,
    skipInit: true,
    files: [],
    cssRulesTool: {
      rulesFolder: "ccc",
    },
    iconReplacerTool: {
      exclude: "ggg",
    },
    windowSizeTool: {
      rules: "hhh",
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
    },
  }
  const expected = {
    inputFolder: "/home/workspace/input",
    outputFolder: "/home/workspace/output",
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    ignorePatternsFile: "eee",
    quiet: true,
    debug: true,
    testMode: false,
    skipInit: false,
    files: [],
    cssRulesTool: {
      rulesFolder: "../css-rules-tool/rules",
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
