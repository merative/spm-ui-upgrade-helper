const invalidCss = require("./invalidCss");

test('Test remove invalid CSS', () => {
  const testData = [
    ".foo .bar {",
    "  background: ${invalid};",
    "}"
  ].join("\n");
  const expectedContents = [
    ".foo .bar {",
    "  background: %PLACEHOLDER_0%;",
    "}"
  ].join("\n");
  const expectedPlaceholders = {
    "%PLACEHOLDER_0%": "${invalid}"
  };

  const { contents, placeholders } = invalidCss.removeInvalidCSS(testData);

  expect(contents).toEqual(expectedContents);
  expect(placeholders).toEqual(expectedPlaceholders);
});

test('Test restore invalid CSS', () => {
  const testContents = [
    ".foo .bar {",
    "  background: %PLACEHOLDER_0%;",
    "}"
  ].join("\n");
  const testPlaceholders = {
    "%PLACEHOLDER_0%": "${invalid}"
  };
  const expected = [
    ".foo .bar {",
    "  background: ${invalid};",
    "}"
  ].join("\n");

  const actual = invalidCss.restoreInvalidCSS(testContents, testPlaceholders);

  expect(actual).toEqual(expected);
});
