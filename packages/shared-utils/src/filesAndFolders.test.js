const shelljs = require("shelljs");
const fileio = require("@folkforms/file-io");
const { writeFilesToDisk } = require("./filesAndFolders");

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
