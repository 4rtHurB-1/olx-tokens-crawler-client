const { CrawlerRunner, TokensCrawler } = require("./carwler");
const { delay } = require("./utils");

const defaultConfigs = require("./defaultConfigs");

module.exports = class AppCrawlerRunner {
  constructor(srcStorage, resultStorage, configStorage, errorsStorage) {
    this.srcStorage = srcStorage;
    this.resultStorage = resultStorage;
    this.errorsStorage = errorsStorage;

    const inputConfigs = configStorage.get();
    this.configs = {
      ...defaultConfigs,
      ...inputConfigs,
    };

    this.errorStats = {};
    console.log("#### Configs", this.configs);
  }

  async process() {
    const accounts = this.srcStorage
      .get()
      .slice(0, this.configs.countLoginsPerOnce);
    this.srcStorage.resave(
      this.srcStorage.get().slice(this.configs.countLoginsPerOnce)
    );

    await new CrawlerRunner(accounts, this.configs)
      .onItemCrawl((crawledResult) => {
        this.resultStorage.save(crawledResult);
        this.errorsStorage.delete(crawledResult);
      })
      .onError((account, crawlerResult) => {
        this.errorStats[account] = (this.errorStats[account] || 0) + 1;

        this.errorsStorage.save(crawlerResult);
        if (this.errorStats[account] < this.configs.maxErrorsPerAccount) {
          this.srcStorage.save(account);
        }
      })
      .run();
  }

  async run() {
    TokensCrawler.setConfigs(this.configs);
    await TokensCrawler.openBrowser();

    let waitBeforeNextLogins;
    do {
      if (waitBeforeNextLogins) {
        console.log(`@@@@@ Waiting ${waitBeforeNextLogins / 60} min.`);
        await delay(waitBeforeNextLogins * 1000);
      }

      try {
        await this.process();
      } catch (e) {
        console.log(e.message);
      }
      waitBeforeNextLogins = this.configs.waitBeforeNextLogins;
    } while (this.srcStorage.get().length);

    await TokensCrawler.closeBrowser();
  }
};
