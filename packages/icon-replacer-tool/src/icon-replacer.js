const chalk = require("chalk");
const utils = require("./io");
const engine = require("./engine");
const sharedUtils = require("../../shared-utils/sharedUtils");

/**
 * Run the bulk image updater script.
 *
 * @param {object} config configuration object
 * @param {string} sourceDir Relative path to new images folder.
 * @param {string} mapPath Relative path to properties file that maps old image filenames to new image filenames.
 */
function run(config, sourceDir, mapPath) {
  // Suppress embedded console info logs.
  if (config.verbose === false) {
    console.info = () => {};
  }

  const start = Date.now();

  const mappings = utils.getIconMappings(mapPath); // get icon mappings

  console.info(`Searching for icon ${chalk.magenta("files")} to replace...`);

  // glob icon files from target directory
  // const iconFiles = utils.readIconFiles(config.outputFolder);
  const iconFiles = sharedUtils.keepFiles(config.files, "png", "svg");
  // console.log(`#### iconFiles = ${JSON.stringify(iconFiles)}`);
  iconFiles.forEach((iconFile) => {
    const name = iconFile.substring(iconFile.lastIndexOf("/") + 1);
    const mapping = engine.getMapping(name, mappings); // check if mapping exists for file

    if (mapping) {
      // console.info(
      //   chalk.cyan(`${iconFile.relativeDirectory}/`) +
      //     `{${chalk.magenta(iconFile.name)} > ${chalk.magenta(mapping)}}`
      // );
      console.info(`{${chalk.magenta(iconFile)} > ${chalk.magenta(mapping)}}`);

      // replace the target icon with the source file specified in the mapping
      utils.replaceIconFile(iconFile, mapping, sourceDir);
    }
  });

  console.info(
    `Searching for icon ${chalk.magenta("references")} to update...`
  );

  // glob all other files from target directory (minus some excluded filetypes)
  const files = utils.readAllFiles(config.outputFolder, config.iconReferenceExclude);
  // console.log(`#### files = ${JSON.stringify(files)}`);
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
