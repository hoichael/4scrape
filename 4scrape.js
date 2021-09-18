// entry point
const init = () => {
  console.log("yo");
  const args = process.argv.slice(2);
  console.log(args);
  console.log(args.length);
};

// call entry point
init();
