const fileio = require("@folkforms/file-io");

/**
 * Converts markdown documents from a standard format to the Gatsby format. Specifically replaces
 * the heading level 1 title with "title: heading" attribute.
 *
 * @param {*} overrides overrides used for testing
 */
const convertDocs = overrides => {
  const inputFolder = overrides && overrides.inputFolder || "FIXME input";
  const outputFolder = overrides && overrides.outputFolder || "FIXME output";

  //copyFiles(inputFolder, outputFolder);
  //modifyFiles(outputFolder);
  //generateNavItems(outputFolder);
}

module.exports = convertDocs;
