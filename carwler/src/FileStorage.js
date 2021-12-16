const fs = require("fs");
const path = require("path");

module.exports = class FileStorage {
  constructor(fileName, idKey) {
    this.fileName = fileName;
    this.idKey = idKey;
    this.get();
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
      if (err.message.indexOf('ENOENT') !== -1) {
        this._save([]);
      }

      return [];
    }
  }

  _prepareToSave(data) {
    return !Array.isArray(data) ? [data] : data;
  }

  _prepareToGet(data) {
    return !Array.isArray(data) ? [data] : data;;
  }

  resave(data) {
    return this._save(this._prepareToSave(data));
  }

  save(data) {
    let allData = (this._get() || []);
    const dataToSave = this._prepareToSave(data);

    if (this.idKey) {
      for (let itemToSave of dataToSave) {
        const found = allData.find(item => item[this.idKey] === itemToSave[this.idKey]);
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
  }

  delete(data) {
    const proxies = this.get().filter(proxy => 
      Array.isArray(data) 
        ? data.find(d => d.url !== proxy.url) 
        : proxy.url !== data.url
    );
    
    return this.resave(proxies);
  }

  clear() {
    this._save([]);
    return this;
  }

  get() {
    return this._prepareToGet(this._get());
  }
}
