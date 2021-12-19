const path = require("path");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getScreenName = (login, screenName) =>
  `${login.split("@")[0]}&${screenName}.png`;

const getScreenPath = (login, screenName) =>
  `screens/${getScreenName(login, screenName)}`;

const getNestedValue = (obj, key) =>
  key
    .split(".")
    .reduce((acc, value) => (acc && acc[value] ? acc[value] : null), obj);

const parseWindowsPath = (str) => str.split(path.sep).join(path.posix.sep);

module.exports = {
  delay,
  getScreenPath,
  getScreenName,
  getNestedValue,
  parseWindowsPath,
};
