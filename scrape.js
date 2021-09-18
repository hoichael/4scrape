// imports
const puppeteer = require("puppeteer");
const strings = require("./strings");

const initScrape = async (args) => {
  const browserInstance = await puppeteer.launch({ headless: true });
  const page = await browserInstance.newPage();

  try {
    await page.goto(args[0]);
    await manageScrape(args, page);
  } catch (error) {
    console.log(strings.stringObj.errorTextURL);
  }

  await browserInstance.close();
  console.log(strings.stringObj.closeText);
  process.exit();
};

const manageScrape = async (args, page) => {
  const jsonArr = await genJSON(page);
  console.log(jsonArr);
};

const genJSON = async (page) => {
  let arr = [];
  const containersArr = await page.$$(".postContainer");

  for (let i = 0; i < containersArr.length; i++) {
    arr.push({
      postNum: await containersArr[i].$eval(".postNum", (el) => el.innerText),
      message: await containersArr[i].$eval(
        ".postMessage",
        (el) => el.innerText
      ),
      img: await checkForImage(containersArr[i]),
    });
  }

  return arr;
};

const checkForImage = async (element) => {
  try {
    const src = await element.$eval("img", (el) => el.getAttribute("src"));
    return src;
  } catch (error) {
    return undefined;
  }
};

module.exports = { initScrape };
