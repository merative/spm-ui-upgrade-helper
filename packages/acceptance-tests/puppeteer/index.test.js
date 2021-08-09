const utils = require("./utils");
const theia = require("./eclipse-theia");
const generateExpectedFileList = require("../scripts/generate-expected-file-list");

jest.setTimeout(30000);

test('puppeteer test 1 (kitchen sink data set)', async () => {

  const expected = generateExpectedFileList("kitchen-sink");

  try {
    // Arrange
    await utils.init();
    await theia.init(utils);

    // Act
    await theia.navigateToMainPage();
    await theia.clickSourceControlGit();
    await theia.runSpmUiUpgradeHelperTool();
    await theia.waitForWorkingMessageToAppear();
    await theia.waitForWorkingMessageToDisappear();
    const actual = await theia.getGitChanges(expected.length);
    
    // Assert
    expect(actual).toEqual(expected);

  } finally {
    await utils.screenshot("error.png");
    await utils.closeBrowser();
  }
});
