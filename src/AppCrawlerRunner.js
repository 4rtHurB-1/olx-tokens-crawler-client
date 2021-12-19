const CrawlerRunner = require("./carwler");
const FileStorage = require("./storages/FileStorage");

module.exports = class AppCrawlerRunner {
  constructor(srcStorage, resultStorage) {
    this.srcStorage = srcStorage;
    this.resultStorage = resultStorage;
  }

  async run() {
    try {
      const configs = new FileStorage("configs", { dataType: "object" }).get();

      const accounts = this.srcStorage.get().slice(0, 5);
      this.srcStorage.resave(this.srcStorage.get().slice(5));

      await new CrawlerRunner(
        accounts,
        configs && !Array.isArray(configs) ? configs : null
      )
        .onItemCrawl((crawledResult) => this.resultStorage.save(crawledResult))
        .onError((account, crawlerResult) => {
          this.srcStorage.save(account);
          this.resultStorage.save(crawlerResult);
        })
        .run();
    } catch (e) {
      console.log(e.message);
    }
  }
};
