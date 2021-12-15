const TokensCrawler = require("./TokensCrawler");
const configs = require('../configs');
const { delay } = require('./utils');
const FileStorage = require('./FileStorage');

module.exports = class CrawlerRunner {
    constructor(inputFile, outputFile) {
        this.inputFileStorage = new FileStorage(inputFile);
        this.outputFileStorage = new FileStorage(outputFile);
    }

    getAccounts() {
        let res = this.inputFileStorage.get();
        console.log(res);
        return res;
    }

    saveResult(result) {
        this.outputFileStorage.save(result);
    }

    async run() {
        await TokensCrawler.openBrowser();

        const result = [];
        for (let account of this.getAccounts()) {
            console.log(`\n##### Account ${account.login}`);
            result.push(await TokensCrawler.crawl(account));
            console.log(`----- Waiting...`);
            await delay(configs.timeouts.perAccount);
        }
    
        await TokensCrawler.closeBrowser();
    
        console.log(`\n##### All tokens:`);
        console.log(result);

        this.saveResult(result);
    }
}