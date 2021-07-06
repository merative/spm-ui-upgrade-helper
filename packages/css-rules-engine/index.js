const css = require('css');
const fileio = require('@folkforms/file-io');
const { applyRules } = require("./src/applyRules");
const utils = require("../shared-utils/sharedUtils");

/**
 * Main method. Will be called via http://localhost:4000/execute
 *
 * We prettify the files as a first step in order to make the final diff as clean as possible.
 */
const execute = () => {
  try {
    // Initial setup
    const config = utils.loadConfig();
    utils.removeOutputFolder(config);
    utils.createGitRepo(config);
    const targetFiles = utils.addTargetFiles(config, "css");
    utils.commitFiles(config.outputFolder, "feat(*): initial commit");

    // Apply the rules to the files
    const rules = utils.loadRules(config);
    const originals = {}, prettified = {}, appliedRules = {};
    console.log(`Processing ${targetFiles.length} files`);
    targetFiles.forEach(filename => {
      const contents = fileio.readLines(filename).join("\n");
      originals[filename] = contents;
      prettified[filename] = prettifyContents(contents, filename);
      appliedRules[filename] = applyRulesToContents(prettified[filename], rules, filename);
      // If there are no functional changes then undo the prettification of the file
      if (utils.identicalArrays(prettified[filename], appliedRules[filename])) {
        delete prettified[filename];
        delete appliedRules[filename];
      }
    });
    console.log(`${Object.keys(appliedRules).length} files were modified`);
    utils.writeFilesToDisk(config, prettified);
    utils.commitFiles(config.outputFolder, "feat(*): prettify files");
    utils.writeFilesToDisk(config, appliedRules);

  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  console.log("All done!");
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
  try {
    const options = { silent: false, source: filename };
    const ast = css.parse(contents, options);
    return css.stringify(ast);
  } catch(err) {
    console.log(`ERROR: Failed to parse file ${err.filename} line ${err.line} column ${err.column}`);
    console.log(`Reason: ${err.reason}`);
    const split = contents.split("\n");
    console.log(`This line may contain invalid CSS: ${split[err.line - 1]}`);
    throw new Error(`${err.reason} in ${err.filename}:${err.line}:${err.column}`);
  }
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
