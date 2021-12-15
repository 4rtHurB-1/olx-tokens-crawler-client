module.exports = {
  "timeouts": {
    "perAccount": 5000,
    "inputLogin": 500,
    "inputPass": 500
  },

  "browser": {
    "headless": false,
    "viewport": { 
      "width": 1440, 
      "height": 1000 
    },
    // "patch": "/usr/bin/google-chrome-stable",      // Patch to browser
    // "profilesDir": "/home/arthurb/.config/google-chrome"     // Patch to Chrome profiles dir
  },

  "crawlCookies": ["access_token", "refresh_token"]
};
