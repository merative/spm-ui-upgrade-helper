const fileio = require("@folkforms/file-io");
const shelljs = require("shelljs");
const { Command } = require('commander');

const allDataSets = fileio.readJson("acceptance-tests/scripts/acceptance-test-data-sets.json");

const program = new Command();
program
  .name("yarn at:build")
  .addHelpText('before', '\nGenerates acceptance test data for release testing.\n') 
  .argument("<dataset>", "Name of dataset to use. See acceptance-tests/scripts/acceptance-test-data-sets.json.")
  .showHelpAfterError(`Possible dataset values: ${Object.keys(allDataSets).join(", ")}.\nSee acceptance-tests/scripts/acceptance-test-data-sets.json.`)
  .parse();

const data = allDataSets[program.args[0]];

/**
 * Generate nested test folders.
 *
 * @param {*} numFolders total number of folders
 * @param {*} folderDepth maximum folder depth
 */
const createFolders = (numFolders, folderDepth) => {
  const folders = [];
  const topLevelFolders = numFolders / folderDepth;
  let count = 0;
  let path = "";
  for(let i = 0 ; i < topLevelFolders; i++) {
    for(let j = 0 ; j < data.folderDepth; j++) {
      path += `${count}/`;
      folders.push(path);
      count++;
    }
    path = "";
  }
  for(let i = 0 ; i < folders.length; i++) {
    shelljs.mkdir("-p", `acceptance-tests/input/${folders[i]}`);
  }
  return folders;
}

/**
 * Add files that have no changes into each of the folders sequentially.
 *
 * @param {*} count number of files to add
 * @param {*} folders list of folders
 */
const addUnchangedFiles = (count, folders) => {
  for(let i = 0; i < count; i++) {
    shelljs.cp("acceptance-tests/scripts/dummy-files/no-updates.css", `acceptance-tests/input/${folders[folderIndex]}/no-updates-${i}.css`);
    folderIndex++;
    if(folderIndex >= folders.length) {
      folderIndex = 0;
    }
  }
}

/**
 * Inserts an index into a filename, e.g. `foo.txt` => `foo-1.txt`.
 *
 * @param {*} file filename
 * @param {*} index index to insert
 */
const getFilenameWithIndex = (file, index) => {
  const dotIndex = file.lastIndexOf(".");
  const name = file.substring(0, dotIndex);
  const ext = file.substring(dotIndex + 1);
  return `${name}-${index}.${ext}`;
}

/**
 * Adds a copy of the given file into each of the folders sequentially.
 *
 * @param {*} file file to copy
 * @param {*} count number of files to create
 */
const addFiles = (file, count, folders) => {
  for(let i = 0; i < count; i++) {
    shelljs.cp(`acceptance-tests/scripts/dummy-files/${file}`, `acceptance-tests/input/${folders[folderIndex]}/${getFilenameWithIndex(file, i)}`);
    folderIndex++;
    if(folderIndex >= folders.length) {
      folderIndex = 0;
    }
  }
}

/**
 * Adds a copy of the given file into each of the folders sequentially, without renaming.
 *
 * @param {*} file file to copy
 * @param {*} count number of files to create
 */
const copyFiles = (file, count, folders) => {
  for(let i = 0; i < count; i++) {
    shelljs.cp(`acceptance-tests/scripts/dummy-files/${file}`, `acceptance-tests/input/${folders[folderIndex]}/${file}`);
    folderIndex++;
    if(folderIndex >= folders.length) {
      folderIndex = 0;
    }
  }
}

/**
 * Adds some ignored files and a `.spm-uiuh-ignore` file.
 */
const addIgnoredFiles = () => {
  // This file will be ignored by OOTB ignores
  const folder1 = "acceptance-tests/input/.git";
  shelljs.mkdir(folder1);
  shelljs.cp("acceptance-tests/scripts/dummy-files/should-be-ignored.css", folder1);
  // This file will be ignored by the .spm-uiuh-ignore file we have added
  const folder2 = "acceptance-tests/input/foo";
  shelljs.mkdir("-p", folder2);
  shelljs.cp("acceptance-tests/scripts/dummy-files/should-be-ignored.css", folder2);
  shelljs.cp("acceptance-tests/scripts/dummy-files/.spm-uiuh-ignore", "acceptance-tests/input");
}

shelljs.rm("-rf", `acceptance-tests/input`);
shelljs.rm("-rf", `acceptance-tests/output`);
shelljs.mkdir(`acceptance-tests/input`);
shelljs.mkdir(`acceptance-tests/output`);

let folderIndex = 0;
const folders = createFolders(data.numFolders, data.folderDepth);
addUnchangedFiles(data.filesWithNoUpdates, folders);
addFiles("has-updates-css.css", data.filesWithCssUpdates, folders);
addFiles("has-updates-icons.properties", data.filesWithIconUpdates, folders);
copyFiles("Chevron_Down_Blue30_10px.png", data.iconFilesToUpdate, folders);
addFiles("has-updates-css-and-icons.css", data.filesWithCssAndIconUpdates, folders);
addIgnoredFiles();
