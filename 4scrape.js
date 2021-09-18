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

const initScrape = (args) => {
  console.log("init");
};

// call entry point
init();
