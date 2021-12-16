const TokensCrawler = require("./TokensCrawler");
const configs = require('../configs');
const { delay } = require('./utils');
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
            console.log(`\n##### Account ${account.login}`);
            try {
                const crawlResult = await TokensCrawler.crawl(account);
                result.push(crawlResult);
                this.saveResult(crawlResult);
                console.log(`----- Waiting...`);
                await delay(configs.timeouts.perAccount);
            } catch(e) {
                console.log(`----- Error: ${e.message}`);
            }
        }
    
        await TokensCrawler.closeBrowser();
    
        console.log(`\n##### All tokens:`);
        console.log(result);

        return result;
    }
}