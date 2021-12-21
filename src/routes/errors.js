const express = require("express");
const router = express.Router();

const ConfigsFileStorage = require("../storages/ConfigsFileStorage");

router.get("/:name", function (req, res, next) {
  const code = req.params.name;
  let text = ``, message = '';

  const configsStorage = new ConfigsFileStorage("configs", { dataType: "object" });

  if (code === 'wrong-dir') {
    message = `Мабуть неправильно вказано profilesDir в файлі configs`;
    text = `В chrome://version перевірте чи "Шлях до профілю" такий самий як тут -> ${configsStorage.get().profilesDir}`;
  } else if(code === 'wrong-path') {
    message = `Мабуть неправильно вказано path в файлі configs`;
    text = `В chrome://version перевірте чи "Виконуваний шлях" такий самий як тут -> ${configsStorage.get().path}`;
  } else if(code === 'close-chrome') {
    message = `Мабуть ви не закрили Chrome`
    text = `Закрийте та вийдіть повністю з нього і спробуйте ще раз...`
  }

  res.render("error", {
    code,
    message,
    text
  });
});

module.exports = router;
