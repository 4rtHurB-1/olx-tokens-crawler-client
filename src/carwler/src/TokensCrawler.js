const puppeteer = require("puppeteer-core");
const fetch = require("node-fetch");

const defaultConfigs = require('../defaultConfigs');
const { delay, getScreenPath, getNestedValue, parseWindowsPath } = require("./utils");

class TokensCrawler {
  static configs = defaultConfigs;

  static setConfigs(configs) {
    this.configs = configs;
  }

  static _getConfig(name) {
    
    return getNestedValue(this.configs, name) || getNestedValue(defaultConfigs, name);
  }

  static async openBrowser() {
    console.log("----- Opening browser");
    const options = {
      headless: this._getConfig('browser.headless'),
      args: [],
    };

    if(this._getConfig('browser.path')) {
      options.executablePath = parseWindowsPath(this._getConfig('browser.path'));
    }

    if (this._getConfig('browser.profilesDir')) {
      options.args.push(`--user-data-dir=${parseWindowsPath(this._getConfig('browser.profilesDir'))}`);
    }

    console.log(options);
    this.browser = await puppeteer.launch(options);

    this.page = await this.browser.newPage();
    console.log("----- Start log out");
    this.page.goto("https://www.olx.ua/uk/account/logout/");
  }

  static async closeBrowser() {
    console.log("----- Closing browser");
    await this.browser.close();
  }

  static async openLoginPage() {
    console.log("----- Opening new page");
    this.page = await this.browser.newPage();
    await this.page.setViewport(this._getConfig('browser.viewport'));
    console.log("----- Going to OLX");
    await this.page.goto("https://www.olx.ua/uk/account");
    await this.page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    );
  }

  static async makeScreen(login, name) {
    await this.page.screenshot({ path: getScreenPath(login, name) });
  }

  static async loginToAccount(accountCreds) {
    console.log("----- Input login");

    await delay(this._getConfig('timeouts.inputLogin'));
    await this.page.evaluate( () => document.getElementById("userEmail").value = "");
    await this.page.type("#userEmail", accountCreds.login);

    await delay(this._getConfig('timeouts.inputLogin'));

    console.log("----- Input pass");
    await this.page.evaluate( () => document.getElementById("userPass").value = "");
    await this.page.type("#userPass", accountCreds.pass);

    await delay(this._getConfig('timeouts.inputPass'));

    console.log("----- Logining");
    await this.page.keyboard.press("Enter");
    // Old ways to click button
    //await this.page.$eval('#loginForm', form => form.submit());
    //await this.page.click("#se_userLogin");

    //await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    await this.page.waitForSelector(".userbox-dd__user-name");
  }

  static async getCookies() {
    console.log("----- Search cookies");
    const cookies = {};
    for (let cookie of await this.page.cookies()) {
      if (this._getConfig('crawlCookies').includes(cookie.name)) {
        cookies[cookie.name] = cookie.value;
      }
    }

    return cookies;
  }

  static async getMe(token) {
    console.log("----- Getting me");
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
    console.log("----- Log out");
    await this.page.goto("https://www.olx.ua/uk/account/logout/");

    console.log("----- Closing page");
    await this.page.close();
  }

  static async crawl(accountCreds) {
    try {
      await this.openLoginPage();
      await this.loginToAccount(accountCreds);
      const tokens = await this.getCookies();
      const account = await this.getMe(tokens.access_token);
      await this.logOutFromAccount();

      return { account, ...tokens };
    } catch (e) {
      await this.makeScreen(accountCreds.login, "error");
      await this.logOutFromAccount();
      throw e;
    }
  }
}

module.exports = TokensCrawler;
