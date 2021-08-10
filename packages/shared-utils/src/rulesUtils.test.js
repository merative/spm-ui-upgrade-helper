const filesAndFolders = require("./filesAndFolders");
const { loadRules } = require("./rulesUtils");

let info = console.info;
beforeEach(() => {
  console.info = () => {};
});

afterEach(() => {
  console.info = info;
});

test('ruleUtils test', () => {
  const overrides = {
    cssRulesTool: {
      rulesFolder: "./src/test-data/rulesUtils/rulesFolder",
    },
    logLevel: "quiet",
  }
  const expected = filesAndFolders.readJson("./src/test-data/rulesUtils/rulesExpected.json");

  const actual = loadRules(overrides);

  expect(actual).toEqual(expected);
});
