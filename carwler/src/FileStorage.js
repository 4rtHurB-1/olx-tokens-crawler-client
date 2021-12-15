const fs = require("fs");
const path = require("path");

module.exports = class FileStorage {
  constructor(fileName) {
    this.fileName = fileName;
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
    return data;
  }

  _prepareToGet(data) {
    return data;
  }

  resave(data) {
    return this._save(this._prepareToSave(data));
  }

  save(data) {
    return this._save([...(this._get() || []), ...this._prepareToSave(data)]);
  }

  delete(data) {
    const proxies = this.get().filter(proxy => 
      Array.isArray(data) 
        ? data.find(d => d.url !== proxy.url) 
        : proxy.url !== data.url
    );
    
    return this.resave(proxies);
  }

  get() {
    return this._prepareToGet(this._get());
  }
}
