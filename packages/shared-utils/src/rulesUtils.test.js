const fileio = require("@folkforms/file-io");
const { loadRules } = require("./rulesUtils");

test('ruleUtils test', () => {
  const overrides = {
    rulesFolder: "./src/test-data/rulesUtils/rulesFolder",
    rulesFolderAdditional: "./src/test-data/rulesUtils/rulesFolderAdditional",
  }
  const expected = fileio.readJson("./src/test-data/rulesUtils/rulesExpected.json");

  const actual = loadRules(overrides);

  expect(actual).toEqual(expected);
});
