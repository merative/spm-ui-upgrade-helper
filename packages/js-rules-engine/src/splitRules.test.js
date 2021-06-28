const { splitRules } = require("../src/splitRules");

test('splitRules test case 1', () => {
  const input = "body foo.bar .muk quz";
  const expected = [ "foo", "bar", "muk", "quz" ];
  const actual = splitRules(input);
  expect(actual).toEqual(expected);
});
