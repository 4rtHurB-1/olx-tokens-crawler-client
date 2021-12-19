const express = require("express");
const router = express.Router();
const fs = require("fs");

const FileStorage = require("../storages/FileStorage");
const { getResultsPath } = require("../utils");

router.get("/", function (req, res, next) {
  const filePath = getResultsPath();

  const results = [];
  fs.readdirSync(filePath).forEach((file) => {
    results.push(file);
  });

  res.render("results", { results });
});

router.get("/:name/file", function (req, res, next) {
  const result = new FileStorage(
    `/results/${req.params.name}`,
    "account"
  ).get();

  res.json(result);
});

router.get("/:name", function (req, res, next) {
  const result = new FileStorage(
    `/results/${req.params.name}`,
    "account"
  ).get();
  res.render("result", {
    result,
    resultName: req.params.name,
  });
});

module.exports = router;
