var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

const CrawlerRunner = require("../carwler");
const FileStorage = require("../carwler/src/FileStorage");
const {delay} = require("../carwler/src/utils");

//multer object creation
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Завантажити файл", info: "Виберіть файл" });
});

router.get("/screens/:name", function (req, res, next) {
  let resultFilePath = `${path.join(__dirname)}/../screens/${req.params.name}`;

  const stat = fs.statSync(resultFilePath);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": stat.size,
  });
  fs.createReadStream(resultFilePath).pipe(res);
});

router.get("/screens", function (req, res, next) {
  let resultFilePath = `${path.join(__dirname)}/../screens/`;

  const screens = [];
  fs.readdirSync(resultFilePath).forEach((file) => {
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

router.get("/results", function (req, res, next) {
  let resultFilePath = `${path.join(__dirname)}/../results/`;

  const results = [];
  fs.readdirSync(resultFilePath).forEach((file) => {
    results.push(file);
  });

  res.render("results", { results });
});

router.get("/results/:name/file", function (req, res, next) {
  let resultFilePath = `${path.join(__dirname)}/../results/${req.params.name}`;
  const stat = fs.statSync(resultFilePath);
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": stat.size,
  });
  fs.createReadStream(resultFilePath).pipe(res);
});

router.get("/results/:name", function (req, res, next) {
  let resultFilePath = `${path.join(__dirname)}/../results/${req.params.name}`;
  console.log(resultFilePath);
  const results = fs.readFileSync(resultFilePath, "utf8");

  res.render("result", {
    result: JSON.parse(results),
    resultName: req.params.name,
  });
});

async function runCrawl(fileStorage, resultFileStorage) {
  try {
    const accounts = fileStorage.get().slice(0, 5);
    fileStorage.resave(fileStorage.get().slice(5));

    const runner = new CrawlerRunner(accounts)
      .onItemCrawl((crawledResult) => resultFileStorage.save(crawledResult))
      .onError((account, crawlerResult) => {
        fileStorage.save(account);
        resultFileStorage.save(crawlerResult)
      });
    
    await runner.run();
  } catch (e) {
    console.log(e.message);
  }
}

router.post("/", upload.single("imageupload"), async function (req, res, next) {
  try {
    const uploadFile = req.file.filename;
    
    res.redirect(`/results/${uploadFile}`);

    const fileStorage = new FileStorage(`/uploads/${uploadFile}`);
    const resultFileStorage = new FileStorage(`/results/${uploadFile}`, 'account').clear();

    while (fileStorage.get().length) {
      await runCrawl(fileStorage, resultFileStorage);
      console.log('@@@ Waiting 5 min.');
      await delay(10000 * 60 * 3);
    }

    //fs.unlinkSync(`${basePath}/uploads/${req.file.filename}`);
    //fs.unlinkSync(resultFilePath);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
