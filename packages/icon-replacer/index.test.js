const bulkImageUpdater = require("@spm/bulk-image-updater");
const shelljs = require("shelljs");
const fileio = require("@folkforms/file-io");

/**
 * Copy input data to temporary location.
 */
const copyTestDataToTemporaryLocation = (inputFolder, tempFolder) => {
  shelljs.rm('-rf', tempFolder);
  shelljs.cp('-r', inputFolder, tempFolder);
}

/**
 * Compare the contents of two folders. Compares the lists of files first, and if they are the same
 * it will then compares the file contents.
 */
const compareFolderContents = (actualFolder, expectedFolder) => {
  const actual = fileio.glob(`${actualFolder}/**`);
  const expected = fileio.glob(`${expectedFolder}/**`);
  // ...Make sure file lists are the same
  const a1 = actual.map(path => path.replace(actualFolder, ""));
  const a2 = expected.map(path => path.replace(expectedFolder, ""));
  expect(a1).toEqual(a2);
  // ...Compare file contents
  for(let i = 0; i < actual.length; i++) {
    const f1 = fileio.readLines(actual[i]);
    const f2 = fileio.readLines(expected[i]);
    expect(f1).toEqual(f2);
  }
}

/**
 * Delete temporary location after the test is finished.
 */
const deleteTemporaryLocation = tempFolder => {
  shelljs.rm('-rf', tempFolder);
}

/**
 * Runs a test using the test data from the given folder.
 */
const runTest = folder => {
  const inputFolder = `${folder}/input`;
  const expectedDataFolder = `${folder}/expected`;
  const tempFolder = "./test-data/temp";

  copyTestDataToTemporaryLocation(inputFolder, tempFolder);
  bulkImageUpdater.run(tempFolder, null, null);
  compareFolderContents(tempFolder, expectedDataFolder);
  deleteTemporaryLocation(tempFolder);
}

/**
 * Add new test case folders to this list and they will be picked up automatically.
 */
const testCaseFolders = [
  // "./test-data/testcase1",
  "./test-data/testcase2",
];

/**
 * Run the test against each of the test case folders.
 */
testCaseFolders.forEach(folder => {
  test(`icon replacement test (from: ${folder})`, () => {
    runTest(folder);
  });
});
