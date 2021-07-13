/**
 * Generates acceptance test data.
 */
const shelljs = require("shelljs");

const noUpdatesCss = 300;
const hasUpdatesCss = 7;

shelljs.rm("-rf", `acceptance-tests/input`);
shelljs.rm("-rf", `acceptance-tests/output`);
shelljs.mkdir(`acceptance-tests/input`);
shelljs.mkdir(`acceptance-tests/output`);

// Create dummy files with no changes
folder = -1;
for(let i = 0; i < noUpdatesCss; i++) {
  if(i % 100 === 0) {
    folder++;
    shelljs.mkdir("-p", `acceptance-tests/input/${folder}`);
  }
  shelljs.cp("acceptance-tests/scripts/dummy-files/no-updates.css", `acceptance-tests/input/${folder}/no-updates-${i}.css`);
}

// Drop a copy of "has-updates.css" into each folder sequentially until i >= hasUpdatesCss.
let folderIndex = 0;
for(let i = 0; i < hasUpdatesCss; i++) {
  shelljs.cp("acceptance-tests/scripts/dummy-files/has-updates.css", `acceptance-tests/input/${folderIndex}/has-updates-${i}.css`);
  folderIndex++;
  if(folderIndex > folder) {
    folderIndex = 0;
  }
}
