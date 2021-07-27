const utils = require("./utils");
const theia = require("./eclipse-theia");

jest.setTimeout(30000);

/**
 * Hard-coding this data because globbing the nested folders takes too long.
 */
const getExpectedChanges = () => {
  const changes = [
    "has-updates-css-4.css",
    "has-updates-css-3.css",
    "has-updates-css-2.css",
    "has-updates-css-1.css",
    "has-updates-css-0.css",
    "has-updates-css-and-icons-1.css",
    "has-updates-css-and-icons-0.css",
    "Chevron_Down_Blue30_10px.png",
    "chevron--down10-on-dark.svg",
    "Chevron_Down_Blue30_10px.png",
    "chevron--down10-on-dark.svg",
    "has-updates-icons-3.properties",
    "has-updates-icons-2.properties",
    "has-updates-icons-1.properties",
    "has-updates-icons-0.properties",
    "has-updates-css-6.css",
    "has-updates-css-5.css",
  ].sort();
  return changes;
}

test('puppeteer test 1 (kitchen sink data set)', async () => {

  const expected = getExpectedChanges();

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
    await utils.closeBrowser();
  }
});
