const fg = require("fast-glob");
const fs = require("fs");
const p = require("path");

/**
 * Get the content of a JSON file and returns a JS object.
 *
 * @param {string} path Path to JSON file.
 * @returns JS object.
 */
function getJSONFile(path) {
  const string = fs.readFileSync(path);
  const json = JSON.parse(string);

  return json;
}

/**
 * Gets the icon mappings object.
 *
 * @param {string} path Path to mappings JSON.
 * @returns Mappings object.
 */
function getIconMappings(path) {
  return getJSONFile(path);
}

/**
 * 
 *
 * @param {string} inputFolder .
 * @param {array} patterns .
 * @returns .
 */
function readFiles(inputFolder, patterns = [], ignore = []) {
  const entries = fg.sync(patterns, { objectMode: true, ignore });

  files = entries.map(({ name, path }) => {
    let file = {
      name,
      path,
      relativeDirectory: p.dirname(p.relative(inputFolder, path)),
    };

    return file;
  });

  return files;
}

/**
 * 
 *
 * @param {string} inputFolder .
 * @returns .
 */
function readIconFiles(inputFolder) {
  const pngPattern = `${inputFolder}/**/*.png`;
  const svgPattern = `${inputFolder}/**/*.svg`;
  const patterns = [pngPattern, svgPattern];

  const iconFiles = readFiles(inputFolder, patterns);

  return iconFiles;
}

/**
 * 
 *
 * @param {*} path .
 */
function deleteFile(path) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
}

/**
 * 
 *
 * @param {*} source .
 * @param {*} destination .
 */
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
  } catch (err) {
    console.error(err);
  }
}

/**
 * 
 *
 * @param {string} path .
 * @param {object} mapping .
 * @param {string} iconsFolder .
 */
function replaceIconFile(path, mapping, iconsFolder) {
  const prevPath = path;
  const nextPath = p.resolve(p.dirname(prevPath), mapping);
  const iconPath = p.resolve(iconsFolder, mapping);

  deleteFile(prevPath);
  copyFile(iconPath, nextPath);
}

/**
 * 
 *
 * @param {string} inputFolder .
 * @param {array} extensions .
 * @returns .
 */
function concatPatterns(inputFolder, extensions) {
  return extensions.map((extension) => {
    return `${inputFolder}/**/*.${extension}`;
  });
}

/**
 * 
 *
 * @param {string} inputFolder .
 * @param {array} extensions .
 * @returns .
 */
function readAllFiles(inputFolder, extensions) {
  const pattern = `${inputFolder}/**/*`;
  const ignore = concatPatterns(inputFolder, extensions);

  const files = readFiles(inputFolder, pattern, ignore);

  return files;
}

/**
 * Gets the contents of the file specified.
 *
 * @param {object} file Object representing a globbed file.
 * @returns Contents of file specified as a string.
 */
function readFileContent(file) {
  let content = null;

  try {
    content = fs.readFileSync(file, "utf8");
  } catch (err) {
    console.error(err);
  }

  return content;
}

/**
 * 
 *
 * @param {object} file Object representing a globbed file.
 * @param {string} content .
 */
function writeFileContent(file, content) {
  try {
    fs.writeFileSync(file, content);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getIconMappings,
  readIconFiles,
  replaceIconFile,
  readAllFiles,
  readFileContent,
  writeFileContent,
};
