const config = require("./config");
const http = require("http");
const https = require("https");
const { StringDecoder } = require("string_decoder");
const stringDecoder = new StringDecoder("utf8");
const fs = require("fs");
const urlParser = require("url");

const startServerCallback = (req, res) => {
  const url = urlParser.parse(req.url, true);

  const path = url.pathname.replace(/^\/+|\/+$/g, "");
  const query = url.query;
  const method = req.method.toLowerCase();

  let buffer;

  req.on("data", data => {
    buffer += stringDecoder.write(data);
  });

  req.on("end", () => {
    buffer += stringDecoder.end();

    const handler = router[path] ? router[path] : handlers.notfound;

    const data = {
      path,
      query,
      method,
      payload: buffer
    };

    handler(data, (statusCode, payload) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });
  });
};

const httpServer = http.createServer(startServerCallback);

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem")
  },
  startServerCallback
);

httpServer.listen(config.httpPort, () => {
  console.log(`HTTP Server listening on port ${config.httpPort}`);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS Server listening on port ${config.httpsPort}`);
});

let handlers = {};

handlers.hello = (data, callback) => {
  callback(
    200,
    `Have a nice day, this is the #! homework assignment of the Pirple NodeJS Master Class`
  );
};

handlers.notfound = (_, callback) => {
  callback(404);
};

const router = {
  hello: handlers.hello
};
