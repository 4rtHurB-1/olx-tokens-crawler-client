const storage = new Map();

module.exports = class Storage {
  constructor(name, idKey) {
    this.name = name;
    this.idKey = idKey;
    this.get();
  }

  _save(data) {
    storage.set(this.name, data);
    return true;
  }

  _get() {
    if(!storage.get(this.name)) {
      this._save([]);
    }
    
    return storage.get(this.name);
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
