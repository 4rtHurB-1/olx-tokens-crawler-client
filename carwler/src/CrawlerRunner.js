const TokensCrawler = require("./TokensCrawler");
const configs = require('../configs');
const { delay, getScreenName } = require('./utils');
const FileStorage = require('./FileStorage');

module.exports = class CrawlerRunner {
    constructor(accounts) {
        this.accounts = accounts;
    }

    onItemCrawl(fn) {
        this.onCrawlItemFn = fn;
        return this;
    }

    onError(fn) {
        this.onErrorFn = fn;
        return this;
    }

    async run() {
        await TokensCrawler.openBrowser();

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
                await delay(configs.timeouts.perAccount);
            } catch(e) {
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
    
        await TokensCrawler.closeBrowser();
    
        console.log(`\n##### All tokens:`);
        console.log(result);

        return result;
    }
}