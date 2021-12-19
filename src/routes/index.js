const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const AppCrawlerRunner = require("../AppCrawlerRunner");
const FileStorage = require("../storages/FileStorage");
const { delay } = require("../utils");

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

router.post("/", upload.single("imageupload"), async function (req, res, next) {
  try {
    const uploadFile = req.file.filename;

    res.redirect(`/results/${uploadFile}`);

    const fileStorage = new FileStorage(`/uploads/${uploadFile}`);
    const resultStorage = new FileStorage(
      `/results/${uploadFile}`,
      "account"
    ).clear();

    let min;
    do {
      if (min) {
        console.log(`@@@@@ Waiting ${min} min.`);
        await delay(1000 * 60 * min);
      }
      await new AppCrawlerRunner(fileStorage, resultStorage).run();
      min = 5;
    } while (fileStorage.get().length)

    //fs.unlinkSync(`${basePath}/uploads/${req.file.filename}`);
    //fs.unlinkSync(resultFilePath);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
