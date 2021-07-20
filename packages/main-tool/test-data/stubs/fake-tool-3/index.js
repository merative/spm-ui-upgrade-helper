const fileio = require("@folkforms/file-io");

const execute = () => {
  console.info("Fake tool 3");
  fileio.writeLines("./test-data/test-case-1/temp/fake-tool-3.txt", [ "fake-tool-3" ]);
  return 0;
}

module.exports = { execute };
