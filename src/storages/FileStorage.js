const fs = require("fs");
const path = require("path");

module.exports = class FileStorage {
  constructor(fileName, { dataType, idKey } = {}) {
    this.fileName = fileName;
    this.idKey = idKey;
    this.dataType = dataType || "array";
  }

  get _emptyData() {
    if (this.dataType === "array") {
      return [];
    } else if(this.dataType === "object") {
      return {};
    }
  }

  _save(data) {
    try {
      fs.writeFileSync(
        path.join(process.cwd(), this.fileName),
        JSON.stringify(data)
      );
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
      return JSON.parse(content);
    } catch (err) {
      if (err.message.indexOf("ENOENT") !== -1) {
        this.clear();
      }

      return this._emptyData;
    }
  }

  _prepareToSave(data) {
    if (this.dataType === "array") {
      return !Array.isArray(data) ? [data] : data;
    } else {
      return data;
    }
  }

  _prepareToGet(data) {
    if (this.dataType === "array") {
      return !Array.isArray(data) ? [data] : data;
    } else {
      return data;
    }
  }

  resave(data) {
    return this._save(this._prepareToSave(data));
  }

  save(data) {
    let allData = this._get();

    if (this.dataType === "array") {
      const dataToSave = this._prepareToSave(data);

      if (this.idKey) {
        for (let itemToSave of dataToSave) {
          const found = allData.find(
            (item) => item[this.idKey] === itemToSave[this.idKey]
          );
          if (found) {
            allData[allData.indexOf(found)] = itemToSave;
          } else {
            allData.push(itemToSave);
          }
        }
      } else {
        allData = allData.concat(dataToSave);
      }

      return this._save(allData);
    } else if(this.dataType === "object" && typeof data === "object") {
      for (let [key, value] of Object.entries(data)) {
        allData[key] = value;
      }
      return this._save(this._prepareToSave(allData));
    }
  }

  delete(data) {
    let allData = this.get();
    if (this.dataType === "array") {
      const proxies = allData.filter((proxy) =>
        Array.isArray(data)
          ? data.find((d) => d[this.idKey] !== proxy[this.idKey])
          : proxy[this.idKey] !== data[this.idKey]
      );

      return this.resave(proxies);
    } else if(this.dataType === "object" && typeof data === "object") {
      for (let key of Object.keys(data)) {
        delete allData[key];
      }
      return this.resave(allData);
    }
  }

  clear() {
    this._save(this._emptyData);
    return this;
  }

  get() {
    return this._prepareToGet(this._get());
  }
};
