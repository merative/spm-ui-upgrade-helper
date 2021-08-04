const fs = require("fs-extra");
const fileio = require("@folkforms/file-io");
const shelljs = require("shelljs");

/**
 * Removes the folder `config.outputFolder`.
 *
 * @param {object} config configuration object
 */
const removeOutputFolder = config => {
  console.info("Deleting existing output folder");
  const cwd = process.cwd();
  shelljs.rm("-rf", `${config.outputFolder}/*`);
  shelljs.rm("-rf", `${config.outputFolder}/.git`);
  shelljs.mkdir('-p', config.outputFolder);
  shelljs.cd(cwd);
}

/**
 * Writes the given files to disk. Expects an object where the keys are the output filenames and the
 * values are the file contents.
 *
 * @param {object} fileData object containing filenames and contents
 */
const writeFiles = fileData => {
  Object.keys(fileData).forEach(filename => {
    let contents = fileData[filename];
    if(typeof contents !== "string") {
      contents = contents.join("\n");
    }
    const folder = filename.substring(0, filename.lastIndexOf('/'));
    fs.mkdirpSync(folder);
    fs.writeFileSync(filename, contents);
  });
}

/**
 * Globs up a list of all files in the input folder.
 *
 * @param {object} config configuration object
 */
const globAllFiles = config => {
  console.info("Collecting input files");
  const startTime = new Date().getTime();
  let inputFiles = [];
  config.globs.forEach(glob => {
    const path = `${config.inputFolder}/${glob}`;
    const files = fileio.glob(path);
    inputFiles.push(files);
  });
  inputFiles = inputFiles.flat();
  const endTime = new Date().getTime();
  console.info(`Collecting input files found ${inputFiles.length} files [${Math.ceil((endTime-startTime)/1000)} seconds]`);
  return inputFiles;
}

/**
 * Filters the given array by keeping only the files with any of the given list of extensions.
 *
 * @param {array} files list of files to filter
 * @param {string} ext files ending in the given extension(s) will be kept in the list
 */
const keepFiles = (files, ...ext) => {
  // Flatten 'ext' for times when we pass an array instead of a spread
  ext = ext.flat();
  const extensions = ext.length > 0 ? ext.map(item => `.${item}`) : null;
  const startTime = new Date().getTime();
  if(extensions) {
    files = files.filter(f => {
      for(let i = 0; i < extensions.length; i++) {
        if(f.endsWith(extensions[i])) {
          return true;
        }
      }
      return false;
    });
  } else {
    throw new Error("You must supply a list of extensions e.g. 'keepFiles(files, \"css\", \"js\")'");
  }
  const endTime = new Date().getTime();
  console.info(`Filtered down to ${files.length} files by keeping extensions '${ext.join(", ")}' [${endTime - startTime} ms]`);
  return files;
}

/**
 * Filters the given array by removing any files with any of the given list of extensions.
 *
 * @param {array} files list of files to filter
 * @param {string} ext files ending in the given extension(s) will be removed from the list
 */
const removeFiles = (files, ...ext) => {
  // Flatten 'ext' for times when we pass an array instead of a spread
  ext = ext.flat();
  const extensions = ext.length > 0 ? ext.map(item => `.${item}`) : null;
  const startTime = new Date().getTime();
  if(extensions) {
    files = files.filter(f => {
      for(let i = 0; i < extensions.length; i++) {
        if(f.endsWith(extensions[i])) {
          return false;
        }
      }
      return true;
    });
  } else {
    throw new Error("You must supply a list of extensions e.g. 'removeFiles(files, \"css\", \"js\")'");
  }
  const endTime = new Date().getTime();
  console.info(`Filtered down to ${files.length} files by removing extensions '${ext.join(", ")}' [${endTime - startTime} ms]`);
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
  console.info(`Copying ${inputFiles.length} files from input folder to output folder`);
  const startTime = new Date().getTime();
  const outputFiles = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    const destFolder = destFile.substring(0, destFile.lastIndexOf('/'));
    shelljs.mkdir('-p', destFolder);
    shelljs.cp(file, destFile);
    outputFiles.push(destFile);
  });
  const endTime = new Date().getTime();
  console.info(`Copying finished [${Math.ceil((endTime-startTime)/1000)} seconds]`);
}

/**
 * Updates the path of all files in `inputFiles` array from `config.inputFolder` =>
 * `config.outputFolder`.
 *
 * @param {*} config configuration object
 * @param {*} inputFiles list of input files
 */
const flipToOutputFiles = (config, inputFiles) => {
  console.info(`Updating paths from input folder to output folder`);
  const startTime = new Date().getTime();
  const files = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.inputFolder, config.outputFolder);
    files.push(destFile);
  });
  const endTime = new Date().getTime();
  console.info(`Updating paths finished [${endTime - startTime} ms]`);
  return files;
}

module.exports = {
  removeOutputFolder,
  writeFiles,
  globAllFiles,
  keepFiles,
  removeFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
};
