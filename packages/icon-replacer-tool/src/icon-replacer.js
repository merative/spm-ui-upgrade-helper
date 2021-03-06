const chalk = require("chalk");
const io = require("./io");
const engine = require("./engine");
const utils = require("../../shared-utils/sharedUtils");

/**
 * Run the bulk image updater script.
 *
 * @param {object} config configuration object
 * @param {string} sourceDir Relative path to new images folder.
 * @param {string} mapPath Relative path to properties file that maps old image filenames to new image filenames.
 */
function run(config, sourceDir, mapPath) {
  const start = Date.now();

  const mappings = io.getIconMappings(mapPath); // get icon mappings

  console.info(`Searching for icon ${chalk.magenta("files")} to replace...`);

  // glob icon files from target directory
  const iconFiles = utils.keepFiles(config.internal.files, "png", "svg");
  console.info(`Processing ${iconFiles.length} files`);
  let modifiedIconCount = 0;
  iconFiles.forEach((iconFile) => {
    const name = iconFile.substring(iconFile.lastIndexOf("/") + 1);
    const mapping = engine.getMapping(name, mappings); // check if mapping exists for file

    if (mapping) {
      // replace the target icon with the source file specified in the mapping
      io.replaceIconFile(iconFile, mapping, sourceDir);
      modifiedIconCount++;
    }
  });
  console.info(`Found and replaced ${modifiedIconCount} icon files`);

  console.info(`Searching for icon ${chalk.magenta("references")} to update...`);

  // glob all other files from target directory (minus some excluded filetypes)
  const files = utils.removeFiles(config.internal.files, config.iconReplacerTool.exclude);
  const filesToWrite = {};
  files.forEach((file) => {
    const prevContent = utils.readLines(file).join("\n"); // read globbed files content
    const nextContent = engine.updateIconReferences(prevContent, mappings); // check if file contains references to update

    // if a file is updated with new references, write that content back to file
    if (nextContent) {
      filesToWrite[file] = nextContent;
    }
  });
  utils.writeFiles(filesToWrite);
  console.info(`${Object.keys(filesToWrite).length} files were modified`);

  const end = Date.now();
  const date = new Date(end - start);

  console.info(`Completed after ${chalk.green(date.getSeconds())} seconds.`);
}

module.exports = { run };
