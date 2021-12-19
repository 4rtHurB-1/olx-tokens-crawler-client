#!/usr/bin/env node

const app = require("../src/app");
const FileStorage = require("../src/storages/FileStorage");
const AppCrawlerRunner = require("../src/AppCrawlerRunner");
const { delay } = require("../src/utils");
const http = require("http");
const open = require("open");
const fs = require("fs");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.setTimeout(6000000);
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
  const dirs = ["./screens", "./results", "./uploads"];
  for (let dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  const configsStorage = new FileStorage("configs", { dataType: "object" });
  if (!configsStorage.get().browser) {
    configsStorage.save({});
  }

  const fileStorage = new FileStorage(`accounts`, { idKey: "login" });

  if (fileStorage.get().length) {
    const resultStorage = new FileStorage("/results/accounts", {
      idKey: "account",
    }).clear();

    const srcFileStorage = new FileStorage(`/uploads/accounts`, {
      idKey: "login",
    });
    srcFileStorage.resave(fileStorage.get());

    // setTimeout(() => {
    //   open(`http://localhost:${port}/results/accounts`);
    // }, 5000);

    let min;
    do {
      if (min) {
        console.log(`@@@@@ Waiting ${min} min.`);
        await delay(1000 * 60 * min);
      }
      await new AppCrawlerRunner(srcFileStorage, resultStorage).run();
      min = 2;
    } while (srcFileStorage.get().length);
    open(`http://localhost:${port}/results/accounts`);
  } else {
    open(`http://localhost:${port}/`);
  }
}
