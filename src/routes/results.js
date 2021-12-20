const express = require("express");
const router = express.Router();

const FileStorage = require("../storages/FileStorage");
const resultFileStorage = new FileStorage(`.result`);

router.get("/file", function (req, res, next) {
  res.json(resultFileStorage.get());
});

router.get("/", function (req, res, next) {
  res.render("result", {
    result: resultFileStorage.get(),
    inProgress: new FileStorage(`.src`).get().length ? true : false,
  });
});

module.exports = router;
