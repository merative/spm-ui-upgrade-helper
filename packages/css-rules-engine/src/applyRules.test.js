const assert = require("assert");
const { applyRules } = require("./applyRules");
const { getTestCaseData } = require("./testCases/getTestCases");

const testCases = getTestCaseData();

describe("applyRules.js test cases",  () => {
  // Loop over test cases and apply the same test to each one
  testCases.forEach(item => {
    const { description, rules, input, expected } = item;
    it(description, async () => {
      const actual = applyRules(rules, input);
      assert.deepStrictEqual(actual, expected);
    });
  })
});
