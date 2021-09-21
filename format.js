const generateTXT = (jsonArr) => {
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

  return outputStringTXT;
};

const generateMD = (jsonArr) => {
  let outputStringMD = "";

  for (let i = 0; i < jsonArr.data.length; i++) {
    outputStringMD += `### No.${jsonArr.data[i].postNum}       ${jsonArr.data[i].dateTime}\n`;
    outputStringMD += `${jsonArr.data[i].message}\n\n`;
    if (jsonArr.data[i].img !== undefined)
      outputStringMD += `![alt text](${jsonArr.data[i].imgURL} "Link to Image (if still online)")\n\n`;
    outputStringMD += "- - -  \n\n";
  }

  return outputStringMD;
};

module.exports = { generateTXT, generateMD };
