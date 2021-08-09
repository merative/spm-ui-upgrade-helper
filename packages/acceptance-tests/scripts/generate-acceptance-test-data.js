const utils = require("../../shared-utils/sharedUtils");
const shelljs = require("shelljs");
const { Command } = require('commander');

const allDataSets = utils.readJson("scripts/datasets.json");

const program = new Command();
program
  .name("yarn at:build")
  .addHelpText('before', '\nGenerates acceptance test data for release testing.\n') 
  .argument("<dataset>", "Name of dataset to use. See scripts/datasets.json.")
  .showHelpAfterError(`Possible dataset values: ${Object.keys(allDataSets).join(", ")}.\nSee scripts/datasets.json.`)
  .parse();

const data = allDataSets[program.args[0]];

/**
 * Generate nested test folders.
 *
 * @param {*} numFolders total number of folders
 * @param {*} folderDepth maximum folder depth
 */
const createFolders = (totalFiles, maxFolderDepth) => {
  const folders = [];
  const topLevelFolders = totalFiles / maxFolderDepth;
  let count = 0;
  let path = "";
  for(let i = 0 ; i < topLevelFolders; i++) {
    for(let j = 0 ; j < data.maxFolderDepth; j++) {
      path += `${count}/`;
      folders.push(path);
      count++;
    }
    path = "";
  }
  for(let i = 0 ; i < folders.length; i++) {
    shelljs.mkdir("-p", `${componentFolder}/${folders[i]}`);
    folders[i] = folders[i].substring(0, folders[i].length - 1);
  }
  return folders;
}

/**
 * Add files that have no changes into each of the folders sequentially.
 *
 * @param {*} count number of files to add
 * @param {*} folders list of folders
 */
const addUnchangedFiles = folders => {
  const count = data.totalFiles - fileCount;
  for(let i = 0; i < count; i++) {
    shelljs.cp("scripts/dummy-files/no-updates.css", `${componentFolder}/${folders[folderIndex]}/no-updates-${i}.css`);
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
    const src = `scripts/dummy-files/${file}`;
    const dest = `${componentFolder}/${folders[folderIndex]}/${getFilenameWithIndex(file, i)}`;
    shelljs.cp(src, dest);
    fileCount++;
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
    shelljs.cp(`scripts/dummy-files/${file}`, `${componentFolder}/${folders[folderIndex]}/${file}`);
    fileCount++;
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
  const folder1 = `input/.git`;
  shelljs.mkdir(folder1);
  shelljs.cp("scripts/dummy-files/should-be-ignored.css", folder1);
  // This file will be ignored by the .spm-uiuh-ignore file we have added
  const folder2 = `input/foo`;
  shelljs.mkdir("-p", folder2);
  shelljs.cp("scripts/dummy-files/should-be-ignored.css", folder2);
  shelljs.cp("scripts/dummy-files/.spm-uiuh-ignore", "input");
  // Test language packs are ignored
  const folder3 = `input/webclient/components/TestLanguagePack_aa`;
  shelljs.mkdir("-p", folder3);
  shelljs.cp("scripts/dummy-files/should-be-ignored.css", folder3);
}

shelljs.rm("-rf", "input");
shelljs.rm("-rf", "output");
const componentFolder = "input/webclient/components/Foo";
shelljs.mkdir("-p", componentFolder);
shelljs.mkdir("output");

let fileCount = 0;
let folderIndex = 0;
const folders = createFolders(data.totalFiles, data.maxFolderDepth);
addFiles("has-updates-css.css", data.cssUpdates, folders);
addFiles("has-updates-icons.properties", data.iconUpdates, folders);
copyFiles("Chevron_Down_Blue30_10px.png", data.iconFiles, folders);
addFiles("has-updates-css-and-icons.css", data.cssAndIconUpdates, folders);
addFiles("has-updates.uim", data.windowSizeUpdates, folders);
addFiles("no-updates.uim", 1, folders);
addUnchangedFiles(folders);
addIgnoredFiles();
