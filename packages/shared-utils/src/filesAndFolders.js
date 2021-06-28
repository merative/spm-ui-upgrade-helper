const fs = require('fs-extra');

/**
 * Writes the given files to disk. Expects an object where the keys are the filenames and the values
 * are the file contents. The output filenames are the input filenames with `config.inputFolder`
 * replaced by `config.outputFolder`.
 *
 * @param {object} config configuration object containing `inputFolder` and `outputFolder` attributes
 * @param {object} files object containing filenames and contents
 */
const writeFilesToDisk = (config, files) => {
  Object.keys(files).forEach(filename => {
    let contents = files[filename];
    if(typeof contents !== "string") {
      contents = contents.join("\n");
    }
    const outputFilename = filename.replace(config.inputFolder, config.outputFolder);
    const folder = outputFilename.substring(0, outputFilename.lastIndexOf('/'));
    fs.mkdirpSync(folder);
    fs.writeFileSync(outputFilename, contents);
  });
}

module.exports = {
  writeFilesToDisk,
};
