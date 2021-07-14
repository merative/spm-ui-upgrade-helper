const fs = require('fs-extra');
const fileio = require('@folkforms/file-io');

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

/**
 * Globs up a list of all files in the input folder.
 *
 * @param {object} config configuration object
 */
const globAllFiles = config => {
  console.log("Collecting input files");
  let startTime = new Date().getTime();
  let inputFiles = fileio.glob(`${config.inputFolder}/**/*`);
  let endTime = new Date().getTime();
  console.log(`Initial search found ${inputFiles.length} files [${Math.ceil((endTime-startTime)/60000)} minutes]`);
  return inputFiles;
}

/**
 * Filters the given array by the given list of extensions.
 *
 * @param {array} files list of files to filter
 * @param {string} ext files ending in the given extension(s) will be included in the repository, or
 * all files will be included if `ext` is falsy or zero-length.
 */
const filterFiles = (files, ...ext) => {
  const extensions = ext.length > 0 ? ext.map(item => `.${item}`) : null;
  let startTime = new Date().getTime();
  if(extensions) {
    files = files.filter(f => {
      for(let i = 0; i < extensions.length; i++) {
        if(f.endsWith(extensions[i])) {
          return true;
        }
      }
      return false;
    });
  }
  let endTime = new Date().getTime();
  console.log(`Filtered down to ${files.length} files based on extensions: ${ext} [${endTime - startTime} ms]`);
  return files;
}

module.exports = {
  writeFilesToDisk,
  globAllFiles,
  filterFiles,
};
