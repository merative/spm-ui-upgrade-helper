const utils = require("../../../../shared-utils/sharedUtils");

const execute = () => {
  console.info("Fake tool 3");
  utils.writeLines("./test-data/test-case-1/temp/fake-tool-3.txt", [ "fake-tool-3" ]);
  return 0;
}

module.exports = { execute };
