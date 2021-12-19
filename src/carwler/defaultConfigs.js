module.exports = {
  "timeouts": {
    "perAccount": 1000,
    "inputLogin": 500,
    "inputPass": 500
  },

  "browser": {
    "headless": false,
    "viewport": { 
      "width": 1440, 
      "height": 1000 
    },
    "path": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",    // Patch to browser Windows
    // "path": "/usr/bin/google-chrome-stable",                                 // Patch to browser Linux
    // "profilesDir": "./profiles"                                              // Patch to Chrome profiles dir Linux
    "profilesDir": "C:\\Users\\1\\AppData\\Local\\Google\\Chrome\\User Data" // Patch to Chrome profiles dir Windows
  },

  "crawlCookies": ["access_token", "refresh_token"]
};
