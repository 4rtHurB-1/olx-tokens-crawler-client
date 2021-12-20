const fs = require("fs");
const path = require("path");
const { splitTextLines } = require("../utils");

module.exports = class ConfigsFileStorage {
  constructor(fileName) {
    this.fileName = fileName;
  }

  _save(data) {
    try {
      fs.writeFileSync(path.join(process.cwd(), this.fileName), data);
      return true;
    } catch (err) {
      return false;
    }
  }

  _get() {
    try {
      let content = fs.readFileSync(
        path.join(process.cwd(), this.fileName),
        "utf8"
      );
      return content;
    } catch (err) {
      if (err.message.indexOf("ENOENT") !== -1) {
        this.clear();
      }

      return "";
    }
  }

  _prepareToGet(data) {
    return splitTextLines(data).reduce((acc, str) => {
      const spl = str.split("=");
      acc[spl[0]] = spl[1];
      return acc;
    }, {});
  }

  clear() {
    this._save("");
    return this;
  }

  get() {
    return this._prepareToGet(this._get());
  }
};
