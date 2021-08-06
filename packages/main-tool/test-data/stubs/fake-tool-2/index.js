const utils = require("../../../../shared-utils/sharedUtils");

const execute = () => {
  console.info("Fake tool 2");
  utils.writeLines("./test-data/test-case-1/temp/fake-tool-2.txt", [ "fake-tool-2" ]);
  return 0;
}

module.exports = { execute };
