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
      dateTime: await (
        await containersArr[i].$eval(".postNum", (el) => el.innerText)
      ).split(" ")[0],
      postNum: await (
        await containersArr[i].$eval(".postNum", (el) => el.innerText)
      ).split(" ")[1],
      replyingTo: await getReplies(containersArr[i]),
      message: await containersArr[i].$eval(
        ".postMessage",
        (el) => el.innerText
      ),
      imgURL: await getImage(containersArr[i], true),
      img: await getImage(containersArr[i], false),
    });
  }

  return arr;
};

const getReplies = async (post) => {
  repliesArr = [];

  try {
    repliesArr = await post.$$eval(".postMessage > .quotelink", (x) =>
      x.map((y) => y.innerText.slice(2))
    );
    return repliesArr;
  } catch (error) {
    return repliesArr;
  }
};

const getImage = async (post, asURL) => {
  try {
    const src = await post.$eval("img", (el) => el.getAttribute("src"));
    if (asURL) {
      return src;
    } else {
      return src.split("/").pop();
    }
  } catch (error) {
    return undefined;
  }
};

module.exports = { initScrape };
