const utils = require("../../../../shared-utils/sharedUtils");

const execute = () => {
  console.info("Fake tool 1");
  utils.writeLines("./test-data/test-case-1/temp/fake-tool-1.txt", [ "fake-tool-1" ]);
  return 0;
}

module.exports = { execute };
