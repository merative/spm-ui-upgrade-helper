const puppeteer = require("puppeteer");

let browser;
let page;

const init = async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });
}

const screenshot = async (path) => {
  await page.screenshot({ path });
}

const getPage = () => page;

const navigateTo = async (url) => {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

const click = async (selector) => {
  const [item] = await page.$x(selector);
  if (item) {
    await item.click();
  } else {
    throw Error(`utils.click: Could not find item using selector: "${selector}"`);
  }
}

const closeBrowser = async () => {
  await browser.close();
}

const utils = {
  init,
  screenshot,
  getPage,
  navigateTo,
  click,
  closeBrowser,
};

module.exports = utils;
