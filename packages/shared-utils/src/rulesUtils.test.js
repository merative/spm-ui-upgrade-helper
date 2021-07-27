const fileio = require("@folkforms/file-io");
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
      rulesFolderAdditional: "./src/test-data/rulesUtils/rulesFolderAdditional",
    },
    quiet: true,
  }
  const expected = fileio.readJson("./src/test-data/rulesUtils/rulesExpected.json");

  const actual = loadRules(overrides);

  expect(actual).toEqual(expected);
});
