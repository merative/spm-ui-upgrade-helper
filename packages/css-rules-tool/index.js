const css = require('css');
const { applyRules } = require("./src/applyRules");
const utils = require("../shared-utils/sharedUtils");

/**
 * Main method. Will be called via http://localhost:4000/execute
 *
 * We prettify the files as a first step in order to make the final diff as clean as possible.
 */
const execute = (overrides = {}) => {
  try {
    const config = { ...utils.loadConfig(), ...overrides };
    utils.init(config);

    // Initial setup
    let targetFiles = config.files;
    targetFiles = utils.keepFiles(targetFiles, "css");

    // Apply the rules to the files
    const rules = utils.loadRules(config);
    const originals = {}, prettified = {}, appliedRules = {};
    console.info(`Processing ${targetFiles.length} files`);
    targetFiles.forEach(filename => {
      const contents = utils.readLines(filename).join("\n");
      try {
        originals[filename] = contents;
        prettified[filename] = prettifyContents(contents, filename);
        appliedRules[filename] = applyRulesToContents(rules, prettified[filename], filename);
        // If there are no functional changes then undo the prettification of the file
        if (utils.identicalData(prettified[filename], appliedRules[filename])) {
          delete prettified[filename];
          delete appliedRules[filename];
        }
      } catch(err) {
        console.warn(`WARNING {`);
        console.warn(`  Message: Failed to parse file ${err.filename} line ${err.line} column ${err.column}`);
        console.warn(`  Reason: ${err.reason}`);
        const split = contents.split("\n");
        console.warn(`  Hint: Line ${err.line} may contain invalid CSS: "${split[err.line - 1].trimEnd()}"`);
        console.warn(`}`);
      }
    });
    console.info(`${Object.keys(appliedRules).length} files were modified`);

    // Save changes
    utils.writeFiles(appliedRules);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.info("css-rules-tool finished");
}

/**
 * Prettify the file contents. This is an important step because modifying the file later will
 * automatically prettify the entire file, so in order to detect if there were functional changes we
 * must prettify the file first so that we know that any subsequent changes are functional changes.
 *
 * @param {array} contents file contents
 * @param {string} filename filename, used for error messages
 */
const prettifyContents = (contents, filename) => {
  ({ contents, placeholders } = utils.removeInvalidCSS(contents));
  const options = { silent: false, source: filename };
  const ast = css.parse(contents, options);
  contents = css.stringify(ast);
  contents = utils.restoreInvalidCSS(contents, placeholders);
  return contents;
}

/**
 * Apply the given user rules to the CSS. Removes know invalid CSS, then applies the rules, then
 * restores the known invalid CSS.
 *
 * "Known invalid CSS" comes from certain SPM CSS variables like `${foo}`. We replace these
 * variables with placeholders while we work on the file and restore the variables later.
 *
 * @param {object} rules user rules to apply
 * @param {string} contents file contents
 * @param {*} filename input filename, only used for error messages
 */
const applyRulesToContents = (rules, contents, filename) => {
  ({ contents, placeholders } = utils.removeInvalidCSS(contents));
  contents = applyRules(rules, contents, filename);
  contents = utils.restoreInvalidCSS(contents, placeholders);
  return contents;
}

module.exports = { execute };
