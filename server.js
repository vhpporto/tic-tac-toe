const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let currentPlayer = "x";

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  if (players.length < 2) {
    players.push(socket);
    socket.emit("start", currentPlayer);
    currentPlayer = currentPlayer === "x" ? "o" : "x";
  }

  socket.on("move", (index, player) => {
    io.emit("move", index, player);
  });

  socket.on("disconnect", () => {
    players = players.filter((p) => p !== socket);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
