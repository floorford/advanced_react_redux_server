// node index.js starts up server
// application starts here!

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

// nodemon watches and rebuilds server!

// using requires instead of import cos of tutorial

// App setup
// morgan & parser are express middleware
// all requests get passed into them by default
// .use registers them as middleware

app.use(morgan("combined"));
// morgan is a logging framework

app.use(bodyParser.json({ type: "*/*" }));
// used to parse incoming requests into json
// type: '*/*' means it will do ALL

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);
console.log(`Server listening on ${port}`);
