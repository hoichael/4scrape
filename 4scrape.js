// imports
const puppeteer = require("puppeteer");

// global vars
const errorText = "oops";
const helpText = "help lol";

// entry point
const init = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printMessage(errorText);
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

  const browserInstance = await puppeteer.launch({ headless: false });
  const page = await browserInstance.newPage();

  try {
    await page.goto(args[0]);
  } catch (error) {
    printMessage(errorText);
  }
};

// call entry point
init();
