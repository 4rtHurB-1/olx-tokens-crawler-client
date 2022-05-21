const { CrawlerRunner, TokensCrawler } = require("./carwler");
const { delay } = require("./utils");
const MAX_ERRORS_PER_ACCOUNT = 2;

module.exports = class AppCrawlerRunner {
  constructor(srcStorage, resultStorage, configStorage, errorsStorage) {
    this.srcStorage = srcStorage;
    this.resultStorage = resultStorage;
    this.configStorage = configStorage;
    this.errorsStorage = errorsStorage;
    this.errorStats = {};
  }

  async process() {
    const browserConfigs = this.configStorage.get();
    const accounts = this.srcStorage.get().slice(0, 5);
    this.srcStorage.resave(this.srcStorage.get().slice(5));

    await new CrawlerRunner(
      accounts,
      browserConfigs && browserConfigs.length ? browserConfigs : null
    )
      .onItemCrawl((crawledResult) => {
        this.resultStorage.save(crawledResult);
        this.errorsStorage.delete(crawledResult);
      })
      .onError((account, crawlerResult) => {
        this.errorStats[account] = (this.errorStats[account] || 0) + 1;

        this.errorsStorage.save(crawlerResult);
        if (this.errorStats[account] < MAX_ERRORS_PER_ACCOUNT) {
          this.srcStorage.save(account);
        }
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
