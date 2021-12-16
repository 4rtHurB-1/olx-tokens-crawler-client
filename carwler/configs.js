module.exports = {
  "timeouts": {
    "perAccount": 1000,
    "inputLogin": 500,
    "inputPass": 500
  },

  "browser": {
    "headless": true,
    "viewport": { 
      "width": 1440, 
      "height": 1000 
    },
    // "patch": "/usr/bin/google-chrome-stable",      // Patch to browser
    // "profilesDir": "./profiles"     // Patch to Chrome profiles dir
  },

  "crawlCookies": ["access_token", "refresh_token"]
};
