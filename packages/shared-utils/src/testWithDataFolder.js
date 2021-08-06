// Fork of https://github.com/folkforms/test-with-data-folder

const shelljs = require("shelljs");
const filesAndFolders = require("./filesAndFolders");

/**
 * Utility class for handling tests that involve test data folders. Copies `inputFolder` to
 * `temporaryFolder`, runs `testFunction`, then compares `temporaryFolder` with `expectedFolder`.
 *
 * It is expected (though not strictly necessary) that `testFunction` will perform work on the files
 * in `temporaryFolder`. This result will then be compared against `expectedFolder`.
 *
 * `temporaryFolder` will be wiped, so be careful.
 *
 * `testFunction` is executed with no arguments. If you need arguments you can wrap it in an
 * anonymous function e.g. `() => { testFunction(args); }`.
 *
 * @param {object} testFunction function under test
 * @param {string} inputFolder folder containing input test data
 * @param {string} expectedFolder folder containing expected test data
 * @param {string} temporaryFolder temporary folder location
 */
const testWithDataFolder = (testFunction, inputFolder, expectedFolder, temporaryFolder) => {
  // Make a copy of input folder as temporary folder
  shelljs.rm("-rf", temporaryFolder);
  shelljs.mkdir("-p", temporaryFolder);
  const files = shelljs.ls(inputFolder);
  if(files.length > 0) {
    shelljs.cp("-r", `${inputFolder}/*`, temporaryFolder);
  }

  // Run the test function
  testFunction();

  // Compare temporary folder with expected folder
  const actualFiles = filesAndFolders.glob(`${temporaryFolder}/**`);
  const expectedFiles = filesAndFolders.glob(`${expectedFolder}/**`);

  // ...Check file lists
  const modActualFiles = actualFiles.map(file => file.replace(temporaryFolder, expectedFolder));
  expect(modActualFiles).toEqual(expectedFiles);

  // ...Check number of files
  expect(actualFiles.length).toEqual(expectedFiles.length);

  // ...Check file contents
  for(let i = 0; i < actualFiles.length; i++) {
    const actualContents = filesAndFolders.readLines(actualFiles[i]);
    const expectedContents = filesAndFolders.readLines(expectedFiles[i]);
    expect(actualContents).toEqual(expectedContents);
  }

  // Remove temporary folder
  shelljs.rm("-rf", temporaryFolder);
}

module.exports = testWithDataFolder;
