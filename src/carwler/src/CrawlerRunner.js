const TokensCrawler = require("./TokensCrawler");
const { delay, getScreenName, getNestedValue } = require("./utils");

module.exports = class CrawlerRunner {
  constructor(accounts, configs) {
    this.accounts = accounts;
    this.configs = configs;

    TokensCrawler.setConfigs(this.configs);
  }

  onItemCrawl(fn) {
    this.onCrawlItemFn = fn;
    return this;
  }

  onError(fn) {
    this.onErrorFn = fn;
    return this;
  }

  _getConfig(name) {
    return getNestedValue(this.configs, name);
  }

  async run() {
    const result = [];
    for (let account of this.accounts) {
      let crawlResult = {};

      console.log(`\n##### Account ${account.login}`);
      try {
        crawlResult = await TokensCrawler.crawl(account);

        if (!crawlResult.account) {
          throw new Error(`Cant login`);
        }

        result.push(crawlResult);
        if (this.onCrawlItemFn) {
          this.onCrawlItemFn(crawlResult);
        }

        console.log(`----- Waiting...`);
        await delay(this._getConfig("waitBeforeLoginToAccount") * 1000);
      } catch (e) {
        console.log(`----- Error: ${e.message}`);

        if (this.onErrorFn) {
          this.onErrorFn(account, {
            account: account.login,
            error: e.message,
            screen: getScreenName(account.login, "error"),
          });
        }
      }
    }

    console.log(`\n##### All tokens:`);
    console.log(result);

    return result;
  }
};
