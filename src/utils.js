const path = require("path");
const os = require("os");
const fs = require("fs");
const { createKoreFile, createGitHubAdaptor } = require("korefile");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getScreenName = (login, screenName) =>
  `${login.split("@")[0]}&${screenName}.png`;

const getScreensPath = () => path.join(process.cwd(), "screens");

const getScreenPath = (screenName) => `${getScreensPath()}/${screenName}`;

const getResultsPath = () => path.join(process.cwd(), "results");

const splitTextLines = (str) => {
  const otherEOL = os.EOL === "\n" ? "\r\n" : "\n";
  const res = str.split(os.EOL);
  const resOther = str.split(otherEOL);

  return resOther.length > res.length ? resOther : res;
};

async function pushFileToGitHub(file, gitHubCreds) {
  try {
    if (!gitHubCreds.apiToken) {
      throw new Error("GitHub api token required");
    }

    const koreFile = createKoreFile({
      adaptor: createGitHubAdaptor({
        owner: gitHubCreds.owner,
        repo: gitHubCreds.repo,
        ref: gitHubCreds.branch,
        token: gitHubCreds.apiToken,
      }),
    });

    await koreFile.writeFile(
      file.name,
      fs.readFileSync(path.join(process.cwd(), file.path), "utf-8")
    );

    console.log(`Success push file ${file.name} to GitHub repository ${gitHubCreds.repo}`);
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = {
  delay,
  getScreenName,
  getScreensPath,
  getScreenPath,
  getResultsPath,
  splitTextLines,
  pushFileToGitHub,
};
