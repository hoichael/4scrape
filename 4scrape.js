#!/usr/bin/env node

// imports
const puppeteer = require("puppeteer");

// global vars
const errorTextArgs = "oops";
const errorTextURL = "oops";
const helpText = "help lol";
const closeText = "we done";

// entry point
const init = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printMessage(errorTextArgs);
  } else if (args.includes("--help") || args.includes("-h")) {
    printMessage(helpText);
  } else {
    initScrape(args);
  }
};

const printMessage = (msg) => {
  console.log(msg);
  process.exit();
};

const initScrape = async (args) => {
  console.log("init");

  const browserInstance = await puppeteer.launch({ headless: true });
  const page = await browserInstance.newPage();

  try {
    await page.goto(args[0]);
  } catch (error) {
    printMessage(errorTextURL);
  }

  try {
    //    const postContainersArr = await page.$$(".postContainer");
    //  await manageScrape(args, page);
  } catch (error) {
    printMessage(errorTextURL);
  }

  await manageScrape(args, page);

  printMessage(closeText);
  await browserInstance.close();
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
    /*
    const text = await containers[i].$eval(".postMessage", (i) => i.innerText);
    console.log(text);
    console.log("\n \n \n");
*/
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

// call entry point
init();
