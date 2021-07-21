/**
 * Generates acceptance test data.
 */
const shelljs = require("shelljs");

const filesPerFolder = 50;
const noUpdatesCssCount = 300;
const hasUpdatesCssCount = 7;
const hasUpdatesIconsCount = 4;
const actualIconFiles = 2;
const hasUpdatesCssAndIconsCount = 2;

// Create dummy files with no changes
folder = -1;
const addUnchangedFiles = count => {
  for(let i = 0; i < count; i++) {
    if(i % filesPerFolder === 0) {
      folder++;
      shelljs.mkdir("-p", `acceptance-tests/input/${folder}`);
    }
    shelljs.cp("acceptance-tests/scripts/dummy-files/no-updates.css", `acceptance-tests/input/${folder}/no-updates-${i}.css`);
  }
}

const getFilenameWithIndex = (file, count) => {
  const dotIndex = file.lastIndexOf(".");
  const name = file.substring(0, dotIndex);
  const ext = file.substring(dotIndex + 1);
  return `${name}-${count}.${ext}`;
}

/**
 * Adds a copy of the given file into each folder sequentially.
 *
 * @param {*} file file to copy
 * @param {*} count number of files to create
 */
const addFiles = (file, count) => {
  let folderIndex = 0;
  for(let i = 0; i < count; i++) {
    shelljs.cp(`acceptance-tests/scripts/dummy-files/${file}`, `acceptance-tests/input/${folderIndex}/${getFilenameWithIndex(file, i)}`);
    folderIndex++;
    if(folderIndex > folder) {
      folderIndex = 0;
    }
  }
}

/**
 * Adds a copy of the given file into each folder sequentially, without renaming.
 *
 * @param {*} file file to copy
 * @param {*} count number of files to create
 */
const copyFiles = (file, count) => {
  let folderIndex = 0;
  for(let i = 0; i < count; i++) {
    shelljs.cp(`acceptance-tests/scripts/dummy-files/${file}`, `acceptance-tests/input/${folderIndex}/${file}`);
    folderIndex++;
    if(folderIndex > folder) {
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

addUnchangedFiles(noUpdatesCssCount);
addFiles("has-updates-css.css", hasUpdatesCssCount);
addFiles("has-updates-icons.properties", hasUpdatesIconsCount);
addFiles("has-updates-css-and-icons.css", hasUpdatesCssAndIconsCount);
copyFiles("Chevron_Down_Blue30_10px.png", actualIconFiles);
addIgnoredFiles();
