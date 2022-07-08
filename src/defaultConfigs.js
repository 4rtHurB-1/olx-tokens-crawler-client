module.exports = {
  // All at seconds
  waitBeforeInputLogin: 0.5, // 0.5 seccond
  waitBeforeInputPass: 0.5, // 0.5 seccond
  waitBeforeLoginToAccount: 5, // 5 seconds
  waitBeforeNextLogins: 60, // 1 minute
  waitAfterLoginToAccount: 15, // 15 secconds

  countLoginsPerOnce: 3,

  maxErrorsPerAccount: 2,

  headless: false,
  viewport: {
    width: 1440,
    height: 1000,
  },

  crawlCookies: ["access_token", "refresh_token"],
};
