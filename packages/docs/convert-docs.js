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
  const outputFolder = overrides && overrides.outputFolder || "temp";
  const skipCopy = overrides && overrides.skipCopy || false;

  if(!skipCopy) {
    copyFiles(docsFolder, outputFolder);
  }
  modifyFiles(outputFolder);
  //generateNavItems(outputFolder);
}

const copyFiles = (docsFolder, outputFolder) => {
  shelljs.cp("-r", `${docsFolder}/*`, outputFolder);
}

const modifyFiles = outputFolder => {
  const files = fileio.glob(`${outputFolder}/**/*.md`);
  files.forEach(file => {
    let contents = fileio.readLines(file);
    contents = contents.map(line => {
      //console.log(`#### line (1) = '${line}'`);
      if(line.startsWith("# ")) {
        line = ["---", `title: ${line.substring(2)}`, "---"];
      }
      //console.log(`#### line (2) = '${line}'`);
      return line;
    });
    contents = contents.flat();
    fileio.writeLines(file, contents);
  });
}

module.exports = convertDocs;
