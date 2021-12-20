const path = require("path");
const os = require("os");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getScreenName = (login, screenName) =>
  `${login.split("@")[0]}&${screenName}.png`;

const getScreensPath = () => path.join(process.cwd(), 'screens');

const getScreenPath = (screenName) =>
  `${getScreensPath()}/${screenName}`;
  
const getResultsPath = () => path.join(process.cwd(), 'results');

const splitTextLines = (str) => {
  const otherEOL = os.EOL === '\n' ? '\r\n' : '\n';
  const res = str.split(os.EOL);
  const resOther = str.split(otherEOL);

  return resOther.length > res.length ? resOther : res;
}

module.exports = {
  delay,
  getScreenName,
  getScreensPath,
  getScreenPath,
  getResultsPath,
  splitTextLines,
};
