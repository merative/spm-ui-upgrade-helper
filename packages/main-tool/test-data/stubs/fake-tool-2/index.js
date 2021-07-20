const fileio = require("@folkforms/file-io");

const execute = () => {
  console.info("Fake tool 2");
  fileio.writeLines("./test-data/test-case-1/temp/fake-tool-2.txt", [ "fake-tool-2" ]);
  return 0;
}

module.exports = { execute };
