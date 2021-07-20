const css = require('css');
const fileio = require('@folkforms/file-io');
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
      const contents = fileio.readLines(filename).join("\n");
      try {
        originals[filename] = contents;
        prettified[filename] = prettifyContents(contents, filename);
        appliedRules[filename] = applyRulesToContents(prettified[filename], rules, filename);
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

    // FIXME Skipping prettifying stage as I suspect it will cause problems when running multiple tools
    // Save changes
    // utils.writeFilesToDisk(config, prettified);
    // utils.commitFiles(config.outputFolder, "feat(*): css service - prettify files");
    utils.writeFilesToDisk(config, appliedRules);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.info("All done!");
}

// FIXME Merge this method with the method below...
/**
 * Prettify the file contents. This is an important step because modifying the file later will
 * automatically prettify the entire file, resulting in style changes that may obscure functional
 * changes. So to avoid this we prettify the file first and apply the rules later.
 *
 * @param {array} contents file contents
 * @param {string} filename filename, used for error messages
 */
const prettifyContents = (contents, filename) => {
  ({ contents, placeholders } = utils.removeInvalidCSS(contents));
  contents = prettify(contents, filename);
  contents = utils.restoreInvalidCSS(contents, placeholders);
  return contents;
}

/**
 * Prettify the given CSS.
 *
 * @param {string} contents file contents
 * @param {string} filename input file, used in error messages
 * @returns {string} the CSS data prettified
 */
const prettify = (contents, filename) => {
    const options = { silent: false, source: filename };
    const ast = css.parse(contents, options);
    return css.stringify(ast);
}

/**
 * FIXME JSDoc
 */
const applyRulesToContents = (contents, rules, filename) => {
  ({ contents, placeholders } = utils.removeInvalidCSS(contents));
  contents = applyRules(rules, contents, filename);
  contents = utils.restoreInvalidCSS(contents, placeholders);
  return contents;
}

module.exports = { execute };