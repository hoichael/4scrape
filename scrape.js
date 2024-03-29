// imports
const puppeteer = require("puppeteer");
const strings = require("./strings");
const format = require("./format");
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
    // check for and handle --all flag
    if (args.includes("--all") || args.includes("-a")) {
        args.push("-j", "-s", "-t", "-m", "-i", "-p");
    }
    // check if valid arg(s) passed
    else {
        let goodToGo = false;

        strings.stringObj.validArgs.forEach((el) => {
            if (args.includes(el)) {
                goodToGo = true;
            }
        });

        if (!goodToGo) {
            console.log(strings.stringObj.errorTextArgs);
            process.exit();
        }
    }

    console.log(strings.stringObj.initText);

    // get relevant data from all posts in json format. this object serves as a base for most of the other output formats
    const jsonArr = await genJSON(page);

    // create directory with unique name based on current date and time (should probably accomodate for different time notations)
    const dirName = new Date().toString().slice(0, 24).replaceAll(":", "_");
    fs.mkdir(dirName);

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
        await fs.writeFile(
            `./${dirName}/yield_text.txt`,
            format.generateTXT(jsonArr)
        );
    }

    if (args.includes("--markdown") || args.includes("-m")) {
        await fs.writeFile(
            `./${dirName}/yield_markdown.md`,
            format.generateMD(jsonArr)
        );
    }

    if (args.includes("--pdf") || args.includes("-p")) {
        await page.pdf({ path: `./${dirName}/yield_pdf.pdf`, format: "A4" });
    }

    if (args.includes("--images") || args.includes("-i")) {
        fs.mkdir(`./${dirName}/images`);

        for (let i = 0; i < jsonArr.data.length; i++) {
            if (
                jsonArr.data[i].imgURL != undefined &&
                jsonArr.data[i].imgURL.split(".").pop() != "webm"
            ) {
                const imgPage = await page.goto(
                    `https:${jsonArr.data[i].imgURL}`
                );
                try {
                    fs.writeFile(
                        `./${dirName}/images/${jsonArr.data[i].img}`,
                        await imgPage.buffer()
                    );
                } catch (error) {
                    console.log(
                        `\n - WARNING: Encountered Error while saving the following image: ${jsonArr.data[i].imgURL} \n   - Skipping Image \n`
                    );
                }
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
        const src = await post.$eval(".fileThumb", (el) =>
            el.getAttribute("href")
        );
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

    for (let i = 0; i < elements.length; i++) {
        await elements[i].hover();
        await page.mouse.down();
        await page.mouse.up();

        // give image some time to load
        await page.waitForTimeout(250);
    }
};

module.exports = { initScrape };
