let utils;
const init = async (u) => utils = u;

const navigateToMainPage = async () => {
  await utils.navigateTo('http://localhost:3000');
}

const clickExplorer = async () => {
  const selector = '//li[@id="shell-tab-explorer-view-container"]';
  await utils.click(selector);
  await _waitForSidebarTitle("EXPLORER: OUTPUT");
}

const clickSourceControlGit = async () => {
  const selector = '//li[@id="shell-tab-scm-view-container"]';
  await utils.click(selector);
  await _waitForSidebarTitle("SOURCE CONTROL:");
}

const _waitForSidebarTitle = async (title) => {
  await utils.getPage().waitForFunction(
    `document.getElementsByClassName("theia-sidepanel-title").length > 0` +
    `&& document.getElementsByClassName("theia-sidepanel-title")[0].innerText.startsWith("${title}")`,
    { timeout: 5000 }
  );
}

const runSpmUiUpgradeHelperTool = async () => {
  const page = utils.getPage();
  await page.focus("div#theia-app-shell");
  await page.keyboard.press('F1');
  await page.keyboard.type('Run SPM');
  await page.keyboard.press('Enter');
}

const waitForWorkingMessageToAppear = async () => {
  await utils.getPage().waitForSelector('div.theia-notification-message', { timeout: 5000 });
}

const waitForWorkingMessageToDisappear = async () => {
  await utils.getPage().waitForSelector('div.theia-notification-message', { hidden: true, timeout: 30000 });
}

/**
 * We need to wait for Theia to update the sidebar icon badge with the correct number of changes.
 *
 * @param {number} numChanges 
 */
const _waitForCorrectNumberOfGitChanges = async (numChanges) => {
  await utils.getPage().waitForFunction(
    `document.getElementsByClassName("theia-badge-decorator-sidebar").length > 0` +
    `&& document.getElementsByClassName("theia-badge-decorator-sidebar")[0].innerText === "${numChanges}"`,
    { timeout: 10000 }
  );
}

const _listGitChanges = async () => {
  const sps = await utils.getPage().$x('//span[contains(@class, "name")]');
  let names = [];
  for(let i = 0; i < sps.length; i++) {
    const spanName = await (await sps[i].getProperty('textContent')).jsonValue();
    names.push(spanName);
  }
  return names.sort();
}

const getGitChanges = async (count) => {
  await _waitForCorrectNumberOfGitChanges(count);
  const gitChanges = await _listGitChanges();
  return gitChanges;
}

const eclipseTheia = {
  init,
  navigateToMainPage,
  runSpmUiUpgradeHelperTool,
  waitForWorkingMessageToAppear,
  waitForWorkingMessageToDisappear,
  clickExplorer,
  clickSourceControlGit,
  getGitChanges,
};

module.exports = eclipseTheia;
