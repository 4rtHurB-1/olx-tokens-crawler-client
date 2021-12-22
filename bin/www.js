#!/usr/bin/env node

const app = require("../src/app");
const FileStorage = require("../src/storages/FileStorage");
const ConfigsFileStorage = require("../src/storages/ConfigsFileStorage");
const AccountFileStorage = require("../src/storages/AccountFileStorage");
const AppCrawlerRunner = require("../src/AppCrawlerRunner");
const http = require("http");
const open = require("open");
const fs = require("fs");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

async function onListening() {
  const dir = "./screens";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const configsStorage = new ConfigsFileStorage("configs", { dataType: "object" });

  const resultStorage = new FileStorage(".result", {
    idKey: "account",
  }).clear();

  const srcStorage = new FileStorage(`.src`, { idKey: "login" });
  srcStorage.resave(new AccountFileStorage(`accounts`).get());

  let openResultTimer = setTimeout(() => {
    open(`http://localhost:${port}/result`);
  }, 5000);

  try {
    await new AppCrawlerRunner(srcStorage, resultStorage, configsStorage).run();
    open(`http://localhost:${port}/result`);
  } catch(e) {
    clearTimeout(openResultTimer);
    const message = e.message;

    let code = e.message;
    if (message.search("Chrome user data dir not found at") !== -1) {
      code = 'wrong-dir';
    } else if(message.search("Failed to launch the browser process! spawn") !== -1) {
      code = 'wrong-path';
    } else if(message.search("Failed to launch the browser process!") !== -1) {
      code = 'close-chrome';
    } else if(message.search("Could not find expected browser") !== -1) {
      code = 'empty-config';
    }

    open(`http://localhost:${port}/errors/${code}`);

    console.log(e.message);
  }
}
