const { loadConfig } = require("./config");

test('config test with defaults', () => {
  const expected = {
    globs: [ "EJBServer/components/**/*", "webclient/components/**/*" ],
    logLevel: "normal",
    cssRulesTool: {
      rulesFolder: "../css-rules-tool/rules",
      rulesFolderCds: "../css-rules-tool/rulesCds",
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
      iconFolder: "/home/theia/packages/icon-replacer-tool/source_files",
      iconMappings: "/home/theia/packages/icon-replacer-tool/icon_mappings.json",
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
      usePixelWidths: true,
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
      rulesFolderCds: "cccddd",
    },
    iconReplacerTool: {
      exclude: "ggg",
      iconFolder: "iii",
      iconMappings: "hhh",
    },
    windowSizeTool: {
      rules: "jjj",
      usePixelWidths: true,
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
      rulesFolderCds: "../some-rules-folderCds",
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
      rulesFolderCds: "../some-rules-folderCds"
    },
    iconReplacerTool: {
      exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
      iconFolder: "/home/theia/packages/icon-replacer-tool/source_files",
      iconMappings: "/home/theia/packages/icon-replacer-tool/icon_mappings.json",
    },
    windowSizeTool: {
      rules: "../window-size-tool/rules.json",
      usePixelWidths: true,
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
