#!/usr/bin/env node

const app = require("../src/app");
const FileStorage = require("../src/storages/FileStorage");
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

  const configsStorage = new FileStorage("configs", { dataType: "object" });
  if (!configsStorage.get().browser) {
    configsStorage.save({});
  }

  const resultStorage = new FileStorage(".result", {
    idKey: "account",
  }).clear();

  const srcStorage = new FileStorage(`.src`, { idKey: "login" });
  srcStorage.resave(new FileStorage(`accounts`).get());

  setTimeout(() => {
    open(`http://localhost:${port}/result`);
  }, 5000);

  await new AppCrawlerRunner(srcStorage, resultStorage, configsStorage).run();

  open(`http://localhost:${port}/result`);
}
