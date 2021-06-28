const fileio = require("@folkforms/file-io");
const fromMarkdown = require('mdast-util-from-markdown');
const { mergeAndSortRules } = require("../../../shared-utils/src/mergeAndSortRules");

/**
 * Parses the given markdown files as test cases. See `example.md` for an explanation of the
 * expected test case format.
 */
const getTestCaseData = () => {
  const testCases = [];
  let files = fileio.glob("./src/testCases/*.md.only");
  if(!files || files.length == 0) {
    files = fileio.glob("./src/testCases/*.md");
  }

  files.forEach(file => {
    if(file.endsWith("/example.md")) {
      return;
    }

    const tree = fromMarkdown(fileio.readLines(file).join("\n"));
    const testCase = {};
    for(let i = 0; i < tree.children.length; i++) {
      const item = tree.children[i];
      if(item.type == "heading" && item.children[0].value == "Description") {
        testCase.description = `${tree.children[i+1].children[0].value} [from file '${file}']`;
      }
      if(item.type == "heading" && item.children[0].value == "Rules") {
        testCase.rules = JSON.parse(tree.children[i+1].value);
        testCase.rules = mergeAndSortRules([testCase.rules]);
      }
      if(item.type == "heading" && item.children[0].value == "Input") {
        testCase.input = tree.children[i+1].value;
      }
      if(item.type == "heading" && item.children[0].value == "Expected") {
        testCase.expected = tree.children[i+1] && tree.children[i+1].value || "";
        testCase.expected = testCase.expected.split("\n");
      }
    };
    testCases.push(testCase);
  });
  return testCases;
}

module.exports = { getTestCaseData };
