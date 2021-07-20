const fileio = require("@folkforms/file-io");

const execute = () => {
  console.info("Fake tool 1");
  fileio.writeLines("./test-data/test-case-1/temp/fake-tool-1.txt", [ "fake-tool-1" ]);
  return 0;
}

module.exports = { execute };
