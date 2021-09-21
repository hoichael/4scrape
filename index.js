#!/usr/bin/env node

// imports
const strings = require("./strings");
const scrape = require("./scrape");

// entry point
const init = () => {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(strings.stringObj.helpText);
    process.exit();
  } else if (args.length < 2) {
    console.log(strings.stringObj.errorTextArgs);
    process.exit();
  } else {
    console.log(strings.stringObj.initText);
    scrape.initScrape(args);
  }
};

// call entry point
init();
