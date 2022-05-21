const express = require("express");
const router = express.Router();

const FileStorage = require("../storages/FileStorage");
const resultFileStorage = new FileStorage(`.result`);
const errorsFileStorage = new FileStorage(`.errors`);

router.get("/file", function (req, res, next) {
  res.json(resultFileStorage.get());
});

router.get("/", function (req, res, next) {
  res.render("result", {
    result: resultFileStorage.get().concat(errorsFileStorage.get()),
    inProgress: new FileStorage(`.in-progress`, { dataType: "object" }).get().inProgress,
  });
});

module.exports = router;
