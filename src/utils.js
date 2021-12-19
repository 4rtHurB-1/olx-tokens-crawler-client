const path = require("path");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getScreenName = (login, screenName) =>
  `${login.split("@")[0]}&${screenName}.png`;

const getScreensPath = () => path.join(process.cwd(), 'screens');

const getScreenPath = (screenName) =>
  `${getScreensPath()}/${screenName}`;
  
const getResultsPath = () => path.join(process.cwd(), 'results');


module.exports = {
  delay,
  getScreenName,
  getScreensPath,
  getScreenPath,
  getResultsPath,
};
