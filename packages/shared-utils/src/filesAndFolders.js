const fs = require("fs-extra");
const fileio = require("@folkforms/file-io");
const shelljs = require("shelljs");

/**
 * Removes the folder `config.outputFolder`.
 *
 * @param {object} config configuration object
 */
const removeOutputFolder = config => {
  const cwd = process.cwd();
  shelljs.rm("-rf", `${config.outputFolder}/*`);
  shelljs.rm("-rf", `${config.outputFolder}/.git`);
  shelljs.mkdir('-p', config.outputFolder);
  shelljs.cd(cwd);
}

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

/**
 * Updates all of the files in `inputFiles` array to `config.outputFolder`, by updating
 * `config.inputFolder` => `config.outputFolder`.
 *
 * @param {*} config configuration object
 * @param {*} inputFiles list of input files
 */
const copyFilesToOutputFolder = (config, inputFiles) => {
  console.log(`Copying ${inputFiles.length} files from input folder to output folder`);
  startTime = new Date().getTime();
  const outputFiles = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    const destFolder = destFile.substring(0, destFile.lastIndexOf('/'));
    shelljs.mkdir('-p', destFolder);
    shelljs.cp(file, destFile);
    outputFiles.push(destFile);
  });
  endTime = new Date().getTime();
  console.log(`Finished copying [${endTime - startTime} ms]`);
}

/**
 * Updates the path of all files in `inputFiles` array from `config.inputFolder` =>
 * `config.outputFolder`.
 *
 * @param {*} config configuration object
 * @param {*} inputFiles list of input files
 */
const flipToOutputFiles = (config, inputFiles) => {
  console.log(`Updating paths from input folder to output folder`);
  startTime = new Date().getTime();
  const files = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    files.push(destFile);
  });
  endTime = new Date().getTime();
  console.log(`Finished updating paths [${endTime - startTime} ms]`);
  return files;
}

module.exports = {
  removeOutputFolder,
  writeFilesToDisk,
  globAllFiles,
  filterFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
};
