const shelljs = require("shelljs");
const fileio = require("@folkforms/file-io");
const testWithDataFolder = require("test-with-data-folder");
const { loadConfig } = require("./config");
const { writeFilesToDisk, globAllFiles, filterFiles, copyFilesToOutputFolder } = require("./filesAndFolders");

const overrides = {
  inputFolder: "src/test-data/filesAndFolders/globAllFiles/input",
  outputFolder: "src/test-data/filesAndFolders/globAllFiles/output",
  ignorePatternsFolder: "src/test-data/filesAndFolders/globAllFiles/ignore",
  ignorePatternsFolderAdditional: "src/test-data/filesAndFolders/globAllFiles/ignoreAdditional",
}

test('filesAndFolders failing test', () => {
  shelljs.rm("-rf", "./src/test-data/filesAndFolders/output");
  shelljs.mkdir("-p", "./src/test-data/filesAndFolders/output");
  const config = {
    inputFolder: "./src/test-data/filesAndFolders/input",
    outputFolder: "./src/test-data/filesAndFolders/output",
  }
  const filename1 = "./src/test-data/filesAndFolders/input/foo.txt";
  const filename2 = "./src/test-data/filesAndFolders/input/bar.txt";
  const files = {
    [filename1]: ["foo","foo","foo"],
    [filename2]: ["bar","bar","bar"],
  };

  writeFilesToDisk(config, files);

  const actual1 = fileio.readLines("./src/test-data/filesAndFolders/output/foo.txt");
  const actual2 = fileio.readLines("./src/test-data/filesAndFolders/output/bar.txt");

  expect(actual1).toEqual(files[filename1]);
  expect(actual2).toEqual(files[filename2]);

  shelljs.rm("-rf", "./src/test-data/filesAndFolders/output");
});

test('filesAndFolders.globAllFiles test', () => {
  const config = loadConfig(overrides);
  const expected = [
    "src/test-data/filesAndFolders/globAllFiles/input/bar.css",
    "src/test-data/filesAndFolders/globAllFiles/input/bar.js",
    "src/test-data/filesAndFolders/globAllFiles/input/foo.css",
    "src/test-data/filesAndFolders/globAllFiles/input/foo.java",
    "src/test-data/filesAndFolders/globAllFiles/input/foo.js",
    "src/test-data/filesAndFolders/globAllFiles/input/foo.properties",
  ].sort();

  const actual = globAllFiles(config);

  expect(actual).toEqual(expected);
});

test('filesAndFolders.filterFiles test', () => {
  const files = [ "good.css", "bad.js", "bad.txt" ];
  const expected = [ "good.css" ];

  const actual = filterFiles(files, "css");

  expect(actual).toEqual(expected);
});

test('filesAndFolders.copyFilesToOutputFolder test', () => {
  const inputFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/input";
  const expectedFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/input"; // Same as input
  const temporaryFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/temp";

  const inputFiles = fileio.glob(`${inputFolder}/**/*`);
  const config = {
    inputFolder,
    outputFolder: temporaryFolder,
  };
  const testFunc = () => { copyFilesToOutputFolder(config, inputFiles); }

  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
});
