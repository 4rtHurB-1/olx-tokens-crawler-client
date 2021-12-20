const { CrawlerRunner, TokensCrawler } = require("./carwler");
const { delay } = require("./utils");

module.exports = class AppCrawlerRunner {
  constructor(srcStorage, resultStorage, configStorage) {
    this.srcStorage = srcStorage;
    this.resultStorage = resultStorage;
    this.configStorage = configStorage;
  }

  async process() {
    const browserConfigs = this.configStorage.get();
    const accounts = this.srcStorage.get().slice(0, 5);
    this.srcStorage.resave(this.srcStorage.get().slice(5));

    await new CrawlerRunner(
      accounts,
      browserConfigs && browserConfigs.length ? browserConfigs : null
    )
      .onItemCrawl((crawledResult) => this.resultStorage.save(crawledResult))
      .onError((account, crawlerResult) => {
        this.srcStorage.save(account);
        this.resultStorage.save(crawlerResult);
      })
      .run();
  }

  async run() {
    TokensCrawler.setConfigs(this.configStorage.get());
    await TokensCrawler.openBrowser();

    let min;
    do {
      if (min) {
        console.log(`@@@@@ Waiting ${min} min.`);
        await delay(1000 * 60 * min);
      }
      try {
        await this.process();
      } catch (e) {
        console.log(e.message);
      }
      min = 2;
    } while (this.srcStorage.get().length);

    await TokensCrawler.closeBrowser();
  }
};
