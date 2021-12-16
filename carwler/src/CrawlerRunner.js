const TokensCrawler = require("./TokensCrawler");
const configs = require('../configs');
const { delay, getScreenName } = require('./utils');
const FileStorage = require('./FileStorage');

module.exports = class CrawlerRunner {
    constructor(inputFile, outputFile) {
        this.inputFileStorage = new FileStorage(inputFile);
        this.outputFileStorage = new FileStorage(outputFile);

        this.outputFileStorage.resave([]);
    }

    getAccounts() {
        return this.inputFileStorage.get();
    }

    saveResult(result) {
        this.outputFileStorage.save(result);
    }

    async run() {
        await TokensCrawler.openBrowser();

        const result = [];
        for (let account of this.getAccounts()) {
            let crawlResult = {};

            console.log(`\n##### Account ${account.login}`);
            try {
                crawlResult = await TokensCrawler.crawl(account);

                console.log(`----- Waiting...`);
                await delay(configs.timeouts.perAccount);
            } catch(e) {
                crawlResult.error = e.message;
                console.log(`----- Error: ${e.message}`);
            }

            if (!crawlResult.account) {
                crawlResult.account = accountCreds.login;
                crawlResult.error = crawlResult.error || 'Unknown';
                crawlResult.screen = getScreenName(accountCreds.login, "after-login");
            }

            result.push(crawlResult);
            this.saveResult(crawlResult);
        }
    
        await TokensCrawler.closeBrowser();
    
        console.log(`\n##### All tokens:`);
        console.log(result);

        return result;
    }
}