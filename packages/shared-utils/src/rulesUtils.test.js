const filesAndFolders = require("./filesAndFolders");
const { loadRules } = require("./rulesUtils");

let info = console.info;
beforeEach(() => {
  console.info = () => {};
  process.env.CURAM_VERSION="8.3";
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
