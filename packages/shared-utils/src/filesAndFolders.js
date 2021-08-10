const fs = require("fs-extra");
const shelljs = require("shelljs");
const globLib = require("fast-glob");

/**
 * Removes the folder `config.internal.outputFolder`.
 *
 * @param {object} config configuration object
 */
const removeOutputFolder = config => {
  console.info("Deleting existing output folder");
  const cwd = process.cwd();
  shelljs.rm("-rf", `${config.internal.outputFolder}/*`);
  shelljs.rm("-rf", `${config.internal.outputFolder}/.git`);
  shelljs.mkdir('-p', config.internal.outputFolder);
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
  config.globs.forEach(g => {
    const path = `${config.internal.inputFolder}/${g}`;
    const files = globLib.sync(path);
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
 * Copies files from `config.internal.inputFolder` to `config.internal.outputFolder`.
 *
 * @param {*} config configuration object
 * @param {*} inputFiles list of input files
 */
const copyFilesToOutputFolder = (config, inputFiles) => {
  console.info(`Copying ${inputFiles.length} files from input folder to output folder`);
  const startTime = new Date().getTime();
  const outputFiles = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.internal.inputFolder, config.internal.outputFolder);
    const destFolder = destFile.substring(0, destFile.lastIndexOf('/'));
    shelljs.mkdir('-p', destFolder);
    shelljs.cp(file, destFile);
    outputFiles.push(destFile);
  });
  const endTime = new Date().getTime();
  console.info(`Copying finished [${Math.ceil((endTime-startTime)/1000)} seconds]`);
}

/**
 * Updates the path of all files in `inputFiles` array from `config.internal.inputFolder` =>
 * `config.internal.outputFolder`.
 *
 * @param {*} config configuration object
 * @param {*} inputFiles list of input files
 */
const flipToOutputFiles = (config, inputFiles) => {
  console.info(`Updating paths from input folder to output folder`);
  const startTime = new Date().getTime();
  const files = [];
  inputFiles.forEach(file => {
    const destFile = file.replace(config.internal.inputFolder, config.internal.outputFolder);
    files.push(destFile);
  });
  const endTime = new Date().getTime();
  console.info(`Updating paths finished [${endTime - startTime} ms]`);
  return files;
}

/**
 * Glob all files according to the given pattern.
 *
 * This is a thin wrapper around `fast-glob` (https://www.npmjs.com/package/fast-glob)
 *
 * @param {string} pattern glob pattern
 * @param {object} options fast-glob options
 * @returns {array} files found
 */
const glob = (pattern, options) => {
  return globLib.sync(pattern, options);
}

/**
 * Read the contents of a file into an array.
 *
 * @param {string} filename file to read
 * @returns {array} file contents
 */
const readLines = filename => {
  return readLinesAsString(filename).split("\n");
}

/**
 * Read the contents of a file into a string.
 *
 * @param {string} filename file to read
 * @returns {string} file contents
 */
const readLinesAsString = filename => {
  const contents = fs.readFileSync(filename, 'utf8');
  return contents;
}

/**
 * Reads a JSON file and converts it to a JS object.
 *
 * @param {string} filename file to read
 * @returns {object} file contents parsed with JSON.parse
 */
const readJson = filename => {
  return JSON.parse(readLinesAsString(filename));
}

/**
 * Writes the given array to a file.
 *
 * @param {string} filename file to write
 * @returns {array} data string or array of lines to write
 */
const writeLines = (filename, data, append = false) => {
  let dataOut;
  if(typeof data === "string") {
    dataOut = data;
  } else {
    dataOut = data.join("\n");
  }
  const options = { flag: append ? "a" : "w" };
  fs.outputFileSync(filename, dataOut, options);
}

/**
 * Copies the given folder recursively, preserving directory structure.
 *
 * @param {string} inputFolder input folder
 * @param {string} outputFolder output folder, will be created if it does not exist
 * @param {object} options options used when globbing up the input files
 */
const copyFolder = (inputFolder, outputFolder, options) => {
  let files = glob(`${inputFolder}/**/*`, options);
  const copyTasks = [];
  files.forEach(f => {
    copyTasks.push({ src: f, dest: f.replace(inputFolder, outputFolder) });
  });
  copyTasks.forEach(c => {
    const folderPart = c.dest.substring(0, c.dest.lastIndexOf("/"));
    shelljs.mkdir("-p", folderPart);
    shelljs.cp(c.src, c.dest);
  });
}

module.exports = {
  removeOutputFolder,
  writeFiles,
  globAllFiles,
  keepFiles,
  removeFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
  glob,
  readJson,
  readLines,
  writeLines,
  copyFolder,
};
