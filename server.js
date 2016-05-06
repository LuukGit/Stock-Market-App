"use strict";

var http = require("http");
var express = require("express");
var mongoose = require("mongoose");

var app = express();
var server = http.createServer(app);
var routes = require("./app/routes/index.js");
var io = require("socket.io").listen(server);

require("dotenv").load();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/client", express.static(process.cwd() + "/client"));

var sockets = [];

io.on("connection", function(socket) {
    sockets.push(socket);
    console.log("connect");

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      console.log("disconnect");
    });

    socket.on("add", function(stock) {
        console.log(stock);
        socket.broadcast.emit("add", stock);
    });

    socket.on("remove", function(stock) {
        console.log(stock);
        socket.broadcast.emit("remove", stock);
    });
});


routes(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
