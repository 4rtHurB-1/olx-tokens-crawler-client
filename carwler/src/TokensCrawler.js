const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

const { delay } = require('./utils');
const configs = require('../configs');

class TokensCrawler {
    static neededCookies = configs.crawlCookies;
    
    static async openBrowser() {
      console.log('----- Opening browser');
      const options = {
        headless: configs.browser.headless,
        args: [],
      };

      if (configs.browser.patch) {
        options.executablePath = configs.browser.patch;
      }

      if (configs.browser.profilesDir) {
        options.args.push(`--user-data-dir=${configs.browser.profilesDir}`);
      }

      this.browser = await puppeteer.launch(options);
    }

    static async closeBrowser() {
      console.log('----- Closing browser');
      await this.browser.close();
    }

    static async openLoginPage() {
        console.log('----- Opening new page');
        this.page = await this.browser.newPage();
        await this.page.setViewport(configs.browser.viewport);
        console.log('----- Going to OLX');
        await this.page.goto("https://www.olx.ua/uk/account");
    }

    static async loginToAccount(accountCreds) {
        console.log('----- Input login');
        await this.page.type("#userEmail", accountCreds.login);

        await delay(configs.timeouts.inputLogin);

        console.log('----- Input pass');
        await this.page.type("#userPass", accountCreds.pass);

        await delay(configs.timeouts.inputPass);

        console.log('----- Logining');
        await this.page.keyboard.press('Enter');
        // Old ways to click button
        //await this.page.$eval('#loginForm', form => form.submit());
        //await this.page.click("#se_userLogin");

        await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    }

    static async getCookies() {
        console.log('----- Search cookies');
        const cookies = {};
        console.log(await this.page.cookies());
        for (let cookie of await this.page.cookies()) {
          if (this.neededCookies.includes(cookie.name)) {
            cookies[cookie.name] = cookie.value;
          }
        }

        console.log(cookies);
        return cookies;
    }

    static async getMe(token) {
        console.log('----- Getting me');
        const url = "https://www.olx.ua/api/v1/users/me/";
      
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          return json.data.email;
        } catch (error) {
          console.error("Error:", error);
        }
    }
    
    static async logOutFromAccount() {
      console.log('----- Log out');
      await this.page.goto('https://www.olx.ua/uk/account/logout/');

      console.log('----- Closing page');
      await this.page.close();
    }

    static async crawl(accountCreds) {
        await this.openLoginPage();
        await this.loginToAccount(accountCreds);
        await this.page.screenshot({path: `${accountCreds.login}.png`});
        const tokens = await this.getCookies();
        const account = await this.getMe(tokens.access_token);
        await this.logOutFromAccount();

        return { account, ...tokens };
    }
}

module.exports = TokensCrawler;