const fileio = require("@folkforms/file-io");
const shelljs = require("shelljs");

/**
 * Converts markdown documents from a standard format to the Gatsby format. Specifically replaces
 * the heading level 1 title with "title: heading" attribute.
 *
 * @param {*} overrides overrides used for testing
 */
const convertDocs = overrides => {
  const docsFolder = overrides && overrides.docsFolder || "../../docs";
  const outputFolder = overrides && overrides.outputFolder || "src/pages";
  const skipCopy = overrides && overrides.skipCopy || false;

  if(!skipCopy) {
    shelljs.rm("-rf", outputFolder);
    fileio.copyFolder(docsFolder, outputFolder);
  }
  modifyFiles(outputFolder);
  //generateNavItems(outputFolder);
}

const modifyFiles = outputFolder => {
  const files = fileio.glob(`${outputFolder}/**/*.md`);
  files.forEach(file => {
    let contents = fileio.readLines(file);
    contents = contents.map(line => {
      if(line.startsWith("[<<")) {
        line = "";
      }
      if(line.startsWith("# ")) {
        line = ["---", `title: ${line.substring(2)}`, "---"];
      }
      return line;
    });
    contents = contents.flat();
    contents = removeEmptyLinesAtStart(contents);
    fileio.writeLines(file, contents);
  });
}

const removeEmptyLinesAtStart = contents => {
  let firstNonEmpty = -1;
  for(let i = 0; i < contents.length; i++) {
    if(contents[i].length > 0) {
      firstNonEmpty = i;
      break;
    }
  }
  if(firstNonEmpty != -1) {
    contents.splice(0, firstNonEmpty);
  }
  return contents;
}

module.exports = convertDocs;
