// node index.js starts up server
// application starts here!

// using requires instead of import cos of tutorial
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");

const app = express();

// nodemon watches and rebuilds server!

// DB Setup
mongoose.connect("mongodb://localhost/auth", { useNewUrlParser: true });
// creates a table called auth in our local mongoDB

const connection = mongoose.connection;

connection.on("connected", function() {
  console.log("Connected to DB");
});

// App setup
// morgan & parser are express middleware
// all requests get passed into them by default
// .use registers them as middleware

app.use(morgan("combined"));
// morgan is a logging framework

app.use(bodyParser.json({ type: "*/*" }));
// used to parse incoming requests into json
// type: '*/*' means it will do ALL
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);
console.log(`Server listening on ${port}`);
