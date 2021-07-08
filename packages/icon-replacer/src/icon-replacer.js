const chalk = require("chalk");

const utils = require("./io");
const engine = require("./engine");

/**
 * Run the bulk image updater script.
 *
 * @param {string} targetDir Relative path to stream folder to be updated.
 * @param {string} sourceDir Relative path to new images folder.
 * @param {string} mapPath Relative path to properties file that maps old image filenames to new image filenames.
 * @param {array} exclude Array of file extensions to be excluded from the icon reference search.
 * @param {boolean} verbose Whether to log icon replacements or not.
 */
function run(targetDir, sourceDir, mapPath, exclude, verbose = false) {
  // Suppress embedded console info logs.
  if (!verbose) {
    console.info = () => {};
  }

  const start = Date.now();

  const mappings = utils.getIconMappings(mapPath); // get icon mappings

  console.info(`Searching for icon ${chalk.magenta("files")} to replace...`);

  // glob icon files from target directory
  const iconFiles = utils.readIconFiles(targetDir);
  iconFiles.forEach((iconFile) => {
    const mapping = engine.getMapping(iconFile.name, mappings); // check if mapping exists for file

    if (mapping) {
      console.info(
        chalk.cyan(`${iconFile.relativeDirectory}/`) +
          `{${chalk.magenta(iconFile.name)} > ${chalk.magenta(mapping)}}`
      );

      // replace the target icon with the source file specified in the mapping
      utils.replaceIconFile(iconFile.path, mapping, sourceDir);
    }
  });

  console.info(
    `Searching for icon ${chalk.magenta("references")} to update...`
  );

  // glob all other files from target directory (minus some excluded filetypes)
  const files = utils.readAllFiles(targetDir, exclude);
  files.forEach((file) => {
    const prevContent = utils.readFileContent(file); // read globbed files content
    const nextContent = engine.updateIconReferences(prevContent, mappings); // check if file contains references to update

    // if a file is updated with new references, write that content back to file
    if (nextContent) {
      console.info(chalk.cyan(`${file.relativeDirectory}/${file.name}`));

      utils.writeFileContent(file, nextContent);
    }
  });

  const end = Date.now();
  const date = new Date(end - start);

  console.info(`Completed after ${chalk.green(date.getSeconds())} seconds.`);
}

module.exports = { run };
