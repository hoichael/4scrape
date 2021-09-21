// imports
const puppeteer = require("puppeteer");
const strings = require("./strings");
const fs = require("fs/promises");

const initScrape = async (args) => {
  const browserInstance = await puppeteer.launch({ headless: true });
  const page = await browserInstance.newPage();
  //  page.setDefaultNavigationTimeout(0);
  //  page.setViewport({ width: 1920, height: 1080 });

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
    args.push("-j", "-s", "-t", "-m", "-i", "-p");
  }

  if (args.includes("--json") || args.includes("-j")) {
    await fs.writeFile(
      `./${dirName}/yield_json.json`,
      JSON.stringify(jsonArr, null, 2)
    );
  }

  if (args.includes("--screenshot") || args.includes("-s")) {
    await clickThumbnails(page);
    await page.screenshot({
      path: `./${dirName}/yield_screenshot.png`,
      fullPage: true,
    });
  }

  if (args.includes("--text") || args.includes("-t")) {
    let outputStringTXT = "";
    for (let i = 0; i < jsonArr.data.length; i++) {
      outputStringTXT += "\n\n";
      outputStringTXT += `Post Date:     ${jsonArr.data[i].dateTime}\n`;
      outputStringTXT += `Post Number:   ${jsonArr.data[i].postNum}\n`;
      if (jsonArr.data[i].img !== undefined)
        outputStringTXT += `Image:         ${jsonArr.data[i].img}\n`;
      outputStringTXT += `\n${jsonArr.data[i].message}`;
      outputStringTXT += "\n\n";
      outputStringTXT +=
        "________________________________________________________________________________________";
    }

    await fs.writeFile(`./${dirName}/yield_text.txt`, outputStringTXT);
  }

  if (args.includes("--markdown") || args.includes("-m")) {
    let outputStringMD = "";
    for (let i = 0; i < jsonArr.data.length; i++) {
      outputStringMD += `### No.${jsonArr.data[i].postNum}       ${jsonArr.data[i].dateTime}\n`;
      outputStringMD += `${jsonArr.data[i].message}\n\n`;
      if (jsonArr.data[i].img !== undefined)
        outputStringMD += `![alt text](${jsonArr.data[i].imgURL} "Link to Image (if still online)")\n\n`;
      outputStringMD += "- - -  \n\n";
    }

    await fs.writeFile(`./${dirName}/yield_markdown.md`, outputStringMD);
  }

  if (args.includes("--pdf") || args.includes("-p")) {
    await page.pdf({ path: `./${dirName}/yield_pdf.pdf`, format: "A4" });
  }

  if (args.includes("--images") || args.includes("-i")) {
    fs.mkdir(`./${dirName}/images`);

    for (let i = 0; i < jsonArr.data.length; i++) {
      //  console.log(jsonArr.data[i]);
      if (
        jsonArr.data[i].imgURL != undefined &&
        jsonArr.data[i].imgURL.split(".").pop() != "webm"
      ) {
        const imgPage = await page.goto(`https:${jsonArr.data[i].imgURL}`);
        fs.writeFile(
          `./${dirName}/images/${jsonArr.data[i].img}`,
          await imgPage.buffer()
        );
      }
    }
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
    const src = await post.$eval(".fileThumb", (el) => el.getAttribute("href"));
    if (asURL) {
      return src;
    } else {
      return src.split("/").pop();
    }
  } catch (error) {
    return undefined;
  }
};

const clickThumbnails = async (page) => {
  const elements = await page.$$(".fileThumb");
  //  console.log(elements.length);

  for (let i = 0; i < elements.length; i++) {
    //  const bounds = await elements[i].boundingBox();
    //  console.log(bounds);

    //  await page.mouse.click(bounds.x + 40, bounds.y + 30);

    await elements[i].hover();
    await page.mouse.down();
    await page.mouse.up();

    // give image some time to load
    await page.waitForTimeout(250);
  }
};

module.exports = { initScrape };
