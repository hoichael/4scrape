// imports
const puppeteer = require("puppeteer");
const strings = require("./strings");
const fs = require("fs/promises");

const initScrape = async (args) => {
  const browserInstance = await puppeteer.launch({ headless: true });
  const page = await browserInstance.newPage();

  try {
    await page.goto(args[0]);
    await manageScrape(args, page);
  } catch (error) {
    console.log(strings.stringObj.errorTextURL);
    process.exit();
  }

  await browserInstance.close();
  console.log(strings.stringObj.closeText);
  process.exit();
};

const manageScrape = async (args, page) => {
  // get relevant data from all posts in json format. this object serves as a base for most of the other output formats
  const jsonArr = await genJSON(page);
  //  console.log(jsonArr);
  // create directory with unique name based on current date and time (should probably accomodate for different time notations)
  const dirName = new Date().toString().slice(0, 24).replaceAll(":", "_");
  fs.mkdir(dirName);

  if (args.includes("--all") || args.includes("-a")) {
    args.push("-j", "-s", "-t", "-i", "-p");
  }

  if (args.includes("--json") || args.includes("-j")) {
    console.log("output: json");
    await fs.writeFile(
      `./${dirName}/yield_json.json`,
      JSON.stringify(jsonArr, null, 2)
    );
  }

  if (args.includes("--screenshot") || args.includes("-s")) {
    console.log("output: screenshot");
  }

  if (args.includes("--text") || args.includes("-t")) {
    console.log("output: text");
  }

  if (args.includes("--pdf") || args.includes("-p")) {
    console.log("output: pdf");
  }

  if (args.includes("--images") || args.includes("-i")) {
    console.log("output: images");
  }
};

const genJSON = async (page) => {
  let jsonOutput = {
    data: [],
  };
  const containersArr = await page.$$(".postContainer");

  for (let i = 0; i < containersArr.length; i++) {
    jsonOutput.data.push({
      dateTime: await (
        await containersArr[i].$eval(".postNum", (el) => el.innerText)
      ).split(" ")[0],
      postNum: await (
        await containersArr[i].$eval(".postNum", (el) => el.innerText)
      )
        .split(" ")[1]
        .slice(3),
      replyingTo: await getReplies(containersArr[i]),
      message: await containersArr[i].$eval(
        ".postMessage",
        (el) => el.innerText
      ),
      imgURL: await getImage(containersArr[i], true),
      img: await getImage(containersArr[i], false),
    });
  }

  return jsonOutput;
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
