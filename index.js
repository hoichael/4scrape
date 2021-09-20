#!/usr/bin/env node

// imports
const strings = require("./strings");
const scrape = require("./scrape");

// entry point
const init = () => {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(strings.stringObj.errorTextArgs);
  } else if (args.includes("--help") || args.includes("-h")) {
    console.log(strings.stringObj.helpText);
  } else {
    scrape.initScrape(args);
  }
};

// call entry point
init();
