const shelljs = require("shelljs");
const testWithDataFolder = require("./testWithDataFolder");
const { loadConfig } = require("./config");
const {
  writeFiles,
  globAllFiles,
  keepFiles,
  removeFiles,
  copyFilesToOutputFolder,
  flipToOutputFiles,
  glob,
  readLines,
  readJson,
  writeLines,
} = require("./filesAndFolders");

let info = console.info;
beforeEach(() => {
  console.info = () => {};
});

afterEach(() => {
  console.info = info;
});

const overrides = {
  inputFolder: "src/test-data/filesAndFolders/globAllFiles/input",
  outputFolder: "src/test-data/filesAndFolders/globAllFiles/output",
  globs: [ "**/*" ],
  ignorePatternsFolder: "src/test-data/filesAndFolders/globAllFiles/ignore",
  ignorePatternsFolderAdditional: "src/test-data/filesAndFolders/globAllFiles/ignoreAdditional",
  logLevel: "quiet",
}

test('filesAndFolders.writeFiles test', () => {
  shelljs.rm("-rf", "./src/test-data/filesAndFolders/temp_writeFiles");
  shelljs.mkdir("-p", "./src/test-data/filesAndFolders/temp_writeFiles");
  const filename1 = "./src/test-data/filesAndFolders/temp_writeFiles/foo.txt";
  const filename2 = "./src/test-data/filesAndFolders/temp_writeFiles/bar.txt";
  const files = {
    [filename1]: ["foo","foo","foo"],
    [filename2]: ["bar","bar","bar"],
  };

  writeFiles(files);

  const actual1 = readLines("./src/test-data/filesAndFolders/temp_writeFiles/foo.txt");
  const actual2 = readLines("./src/test-data/filesAndFolders/temp_writeFiles/bar.txt");

  expect(actual1).toEqual(files[filename1]);
  expect(actual2).toEqual(files[filename2]);

  shelljs.rm("-rf", "./src/test-data/filesAndFolders/temp_writeFiles");
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

test('filesAndFolders.keepFiles test', () => {
  const files = [ "good.css", "bad.js", "bad.txt" ];
  const expected = [ "good.css" ];

  const actual = keepFiles(files, "css");

  expect(actual).toEqual(expected);
});

test('filesAndFolders.removeFiles test', () => {
  const files = [ "bad.css", "good.js", "bad.txt" ];
  const expected = [ "good.js" ];

  const actual = removeFiles(files, "css", "txt");

  expect(actual).toEqual(expected);
});

test('filesAndFolders.copyFilesToOutputFolder test', () => {
  const inputFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/input";
  const expectedFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/input"; // Same as input
  const temporaryFolder = "src/test-data/filesAndFolders/copyFilesToOutputFolder/temp";

  const inputFiles = glob(`${inputFolder}/**/*`);
  const config = {
    inputFolder,
    outputFolder: temporaryFolder,
    logLevel: "quiet",
  };
  const testFunc = () => { copyFilesToOutputFolder(config, inputFiles); }

  testWithDataFolder(testFunc, inputFolder, expectedFolder, temporaryFolder);
});

test('filesAndFolders.flipToOutputFiles test', () => {
  const input = [ "input/foo.txt", "input/bar.txt" ];
  const expected = [ "output/foo.txt", "output/bar.txt" ];
  const config = {
    inputFolder: "input",
    outputFolder: "output",
    logLevel: "quiet",
  }

  const actual = flipToOutputFiles(config, input);

  expect(actual).toEqual(expected);
});

test('filesAndFolders.removeOutputFolder dummy test ', () => {
  expect(true).toEqual(true);
});
