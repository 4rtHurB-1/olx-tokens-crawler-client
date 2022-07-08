const puppeteer = require("puppeteer-core");
const fetch = require("node-fetch");

const { delay, getScreenPath, getNestedValue, parseExecPath } = require("./utils");

class TokensCrawler {
  static configs = {};

  static setConfigs(configs) {
    this.configs = configs;
  }

  static _getConfig(name) {
    
    return getNestedValue(this.configs, name);
  }

  static async openBrowser() {
    console.log("----- Opening browser");
    const options = {
      headless: this._getConfig('headless'),
      args: [],
    };

    if(this._getConfig('path')) {
      options.executablePath = parseExecPath(this._getConfig('path'));
    }

    if (this._getConfig('profilesDir')) {
      options.args.push(`--user-data-dir=${parseExecPath(this._getConfig('profilesDir').replace('Default', ''))}`);
    }

    console.log(options);
    this.browser = await puppeteer.launch(options);

    const page = await this.browser.newPage();
    console.log("----- Opening browser [OK]");
    console.log("----- Start log out");
    page.goto("https://www.olx.ua/uk/account/logout/").then(() => {
      console.log("----- Start log out [OK]");
      page.close();
    });
  }

  static async closeBrowser() {
    console.log("----- Closing browser");
    await this.browser.close();
    console.log("----- Closing browser [OK]");
  }

  static async openLoginPage() {
    console.log("----- Opening new page");
    this.page = await this.browser.newPage();
    await this.page.setViewport(this._getConfig('viewport'));
    console.log("----- Opening new page [OK]");
    console.log("----- Going to OLX");
    await this.page.goto("https://www.olx.ua/uk/account");
    await this.page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
      );
    console.log("----- Going to OLX [OK]");
  }

  static async makeScreen(login, name) {
    await this.page.screenshot({ path: getScreenPath(login, name) });
  }

  static async loginToAccount(accountCreds) {
    console.log(`----- Input login: ${accountCreds.login}`);
    
    await delay(this._getConfig('waitBeforeInputLogin') * 1000);
    await this.page.evaluate( () => document.getElementById("userEmail").value = "");
    await this.page.type("#userEmail", accountCreds.login);
    console.log(`----- Input login: ${accountCreds.login} [OK]`);

    await delay(this._getConfig('waitBeforeInputLogin') * 1000);

    console.log(`----- Input pass: ${accountCreds.pass}`);
    await this.page.evaluate( () => document.getElementById("userPass").value = "");
    await this.page.type("#userPass", accountCreds.pass);
    console.log(`----- Input pass: ${accountCreds.pass} [OK]`);

    await delay(this._getConfig('waitBeforeInputPass') * 1000);

    console.log("----- Logining");
    await this.page.keyboard.press("Enter");
    // Old ways to click button
    //await this.page.$eval('#loginForm', form => form.submit());
    //await this.page.click("#se_userLogin");
    
    //await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    //await this.page.waitForSelector("[data-cy=myolx-link]");
    await delay(this._getConfig("waitAfterLoginToAccount") * 1000);
    console.log("----- Logining [OK]");
  }

  static async getCookies() {
    console.log("----- Search cookies");
    const cookies = {};
    for (let cookie of await this.page.cookies()) {
      if (this._getConfig('crawlCookies').includes(cookie.name)) {
        cookies[cookie.name] = cookie.value;
      }
    }
    
    console.log("----- Search cookies [OK]");
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
      console.log("----- Getting me [OK]");
      return json.data.email;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  static async logOutFromAccount() {
    console.log("----- Log out");
    await this.page.goto("https://www.olx.ua/uk/account/logout/");
    console.log("----- Log out [OK]");

    console.log("----- Closing page");
    await this.page.close();
    console.log("----- Closing page [OK]");
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
