const generateExpectedFileList = require("./generate-expected-file-list");

const expected = [
  "has-updates-css-4.css",
  "has-updates-css-3.css",
  "has-updates-css-2.css",
  "has-updates-css-1.css",
  "has-updates-css-0.css",
  "has-updates-css-and-icons-1.css",
  "has-updates-css-and-icons-0.css",
  "Chevron_Down_Blue30_10px.png",
  "chevron--down10-on-dark.svg",
  "Chevron_Down_Blue30_10px.png",
  "chevron--down10-on-dark.svg",
  "has-updates-icons-3.properties",
  "has-updates-icons-2.properties",
  "has-updates-icons-1.properties",
  "has-updates-icons-0.properties",
  "has-updates-css-6.css",
  "has-updates-css-5.css",
  "has-updates-1.uim",
  "has-updates-0.uim",
  "has-updates-2.uim"
].sort();

test('kitchen-sink file list', () => {
  const actual = generateExpectedFileList("kitchen-sink");
  expect(actual).toEqual(expected);
});
