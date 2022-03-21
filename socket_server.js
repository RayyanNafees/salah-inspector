// npm install express socket.io

const express = require("express");

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("./"));

app.get("/", (_, res) => {
  res.send("<h1>Just a socket server!</h1>");
});

io.on("connection", function (socket) {
  //
  socket.on("input", (data) => {
    io.sockets.emit("output", data);
  });

  socket.on("empty all", () => {
    io.sockets.emit("empty");
  });
});

http.listen(process.env.PORT || 3000, function () {
  console.log(
    process.env.PORT
      ? "Hosted on salah-inspector.herokuapp.com"
      : "listening on localhost:3000"
  );
});
