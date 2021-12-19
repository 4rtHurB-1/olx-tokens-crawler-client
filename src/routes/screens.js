const express = require("express");
const router = express.Router();
const fs = require("fs");

const { getScreenPath } = require("../utils");

router.get("/:name", function (req, res, next) {
  const filePath = getScreenPath(req.params.name);

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": stat.size,
  });
  fs.createReadStream(filePath).pipe(res);
});

module.exports = router;
