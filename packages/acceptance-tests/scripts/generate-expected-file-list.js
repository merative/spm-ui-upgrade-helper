const utils = require("../../shared-utils/sharedUtils");

const generateExpectedFileList = datasetName => {
  const datasetsJson = utils.readJson("scripts/datasets.json");
  const dataset = datasetsJson[datasetName];
  let changes = [];

  for(let i = 0; i < dataset.cssUpdates; i++) {
    changes.push(`has-updates-css-${i}.css`);
  }
  for(let i = 0; i < dataset.iconUpdates; i++) {
    changes.push(`has-updates-icons-${i}.properties`);
  }
  for(let i = 0; i < dataset.cssAndIconUpdates; i++) {
    changes.push(`has-updates-css-and-icons-${i}.css`);
  }
  for(let i = 0; i < dataset.iconFiles; i++) {
    changes.push("Chevron_Down_Blue30_10px.png");
    changes.push("chevron--down10-on-dark.svg");
  }
  for(let i = 0; i < dataset.windowSizeUpdates; i++) {
    changes.push(`has-updates-${i}.uim`);
  }
  return changes.sort();
};

module.exports = generateExpectedFileList;
