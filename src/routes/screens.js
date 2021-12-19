const express = require("express");
const router = express.Router();
const fs = require("fs");

const { getScreensPath, getScreenPath } = require("../utils");

router.get("/:name", function (req, res, next) {
  const filePath = getScreenPath(req.params.name);

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": stat.size,
  });
  fs.createReadStream(filePath).pipe(res);
});

router.get("/", function (req, res, next) {
  const filePath = getScreensPath();

  const screens = [];
  fs.readdirSync(filePath).forEach((file) => {
    const login = file.split("&")[0];

    let loginScreens = screens.find((scr) => scr.login === login);
    if (!loginScreens) {
      loginScreens = {
        login,
        screens: [],
      };
      screens.push(loginScreens);
    }

    loginScreens.screens.push(file);
  });

  res.render("screens", { screens });
});

module.exports = router;
