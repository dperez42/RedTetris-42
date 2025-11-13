// npm start
// https://github.com/Ysrbolles/Red-tetris-42Network/blob/main/index.js
// https://github.com/sawyerf/red-tetris/blob/main/back/utils/Game.ts

const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const path = require('path');
const Redtetris = require("./Classes/Redtetris.js");
const Game = require("./Classes/Game.js");
const Player = require("./Classes/Player.js");
const dotenv = require('dotenv');

// INIT REDTETRIS
let redtetris = new Redtetris()

// get config vars from .env
dotenv.config({path: __dirname + '/.env'})

const PORT = process.env.SERVER_PORT || 3000;
const app = express();
const server = http.createServer(app);

// Define CORS
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST"] 
};
app.use(cors(corsOptions));

// Socket configuration
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
  },
  path: "",
});
io.on("connection", async (socket) => {
  let param_check = true
  let msg = {
      'command':'info',
      'data': "CONNECTED TO SERVER"
  }
  socket.emit('red_tetris_client',msg)
  console.log("Client Connected From", socket.handshake.headers.referer, socket.id);
  const url_data = socket.handshake.headers.referer.split('/')
  // check parameters
  if (url_data.length !== 5){
    let msg = {
      'command':'error',
      'data': "NOT CORRECT PARAMETERS"
    }
    socket.emit('red_tetris_client',msg)
    console.log("Error parameters:", url_data)
    param_check = false
  }
  if (param_check) {
    const roomName = url_data[3]
    const playerName =url_data[4]
    console.log("Parameters:", roomName, playerName)
    const room_exists =  redtetris.checkGame(roomName)
      // Check if Game exists?

      if (!room_exists){
        console.log("creating game.", roomName)
        const game = new Game(roomName, redtetris.getScore())
        console.log("Player:", playerName, " init Room:", roomName)
        const player = new Player(10,20, playerName,socket.id)
        game.addPlayer(player, socket.id) // quito este array socketid
        redtetris.addGame(game)
        // send update msg to all player in the game
        game.sendUpdate(io)
      } else {
        // search game by name
        console.log('Game ', roomName," exist.")
        const game = redtetris.getGame(roomName)
        // check if user is in game yet
        const check_player = game.checkPlayer(playerName)
        if (!check_player) {
          console.log("Player:", playerName, " join to Room:", roomName)
          const player = new Player(10,20, playerName,socket.id)
          game.addPlayer(player, socket.id)
          game.info()
          // send update msg to all player in the game
          game.sendUpdate(io)
        } else {
          console.log("Player:", playerName, " already in Room:", roomName)
        }
      }
  }
  // 
  socket.on("red_tetris_server", async (data) => {
    //console.log("msg recieved in red-tetris server from ",socket.id,".",data)  
    if (data.command==='join'){
        //console.log("exist game?", data.roomName)
        const room_exists =  redtetris.checkGame(data.roomName)
        //console.log(room_exists)
        // Check if Game exists?
        if (!room_exists){
          console.log("creating game.", data.roomName)
          const game = new Game(data.roomName, redtetris.getScore())
          console.log("Player:", data.playerName, " init Room:", data.roomName)
          const player = new Player(10,20, data.playerName,socket.id)
          game.addPlayer(player, socket.id) // quito este array socketid
          redtetris.addGame(game)
          // send update msg to all player in the game
          game.sendUpdate(io)
        } else {
          // search game by name
          console.log('Game ',data.roomName," exist.")
          const game = redtetris.getGame(data.roomName)
          // check if user is in game yet
          const check_player = game.checkPlayer(data.playerName)
          if (!check_player) {
            console.log("Player:", data.playerName, " join to Room:", data.roomName)
            const player = new Player(10,20, data.playerName,socket.id)
            game.addPlayer(player, socket.id)
            game.info()
            // send update msg to all player in the game
            game.sendUpdate(io)
          } else {
            console.log("Player:", data.playerName, " already in Room:", data.roomName)
          }
        }
        
    }
    if (data.command==='start'){
      console.log("recieve startCountdown", data)
      // search game by name
      const game = redtetris.getGame(data.gameName)
      game.setmode(data.mode, data.ghost_mode)
      console.log("game",game)
      game.startCountdown(io)      
    }
    if (data.command==='pause'){
      console.log("recieve pause", data.gameName)
      // search game by name
      const game = redtetris.getGame(data.gameName)
      game.pause()      
    }
    if (data.command==='restart'){
      console.log("recieve pause", data.gameName)
      // search game by name
      const game = redtetris.getGame(data.gameName)
      game.init(io)      
    }
    if (data.command==='move'){
      //console.log("recieve move", data)
      // search game by name
      const game = redtetris.getGame(data.gameName)
      const ghost_mode = game.getGhostMode()
      //console.log(game)
      const player = game.getPlayerBySocket(data.playerSocket)
      //console.log(player)
      player.movePiece(data.move,1,[],ghost_mode)
      // send update msg to all player in the game
      game.sendUpdate(io)
    }
  });
   
  socket.on("disconnect", () => {
    console.log("socket disconnect",socket.id)
    const game = redtetris.getGameBySocket(socket.id)
    if (game){
      // delete player with socket look in all games 
      game.delPlayerBySocket(socket.id)
      // send update msg to all player in the game
      game.sendUpdate(io)
    }
  });
});

app.disable('etag') //disable etag to avoid 304 during development
// Serve static files FIRST (before routes)
app.use(express.static(path.join(__dirname, "dist"), {
  cacheControl: false,
  etag: false,
})
);
app.use(express.static(path.join(__dirname, "html_error"), {
  cacheControl: false,
  etag: false,
})
);
// Log all incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.path);
  next();
});
// Dynamic route for room/user
app.get("/:room/:user", (req, res) => {
  const { room, user } = req.params;
  console.log(`Request: room=${room}, user=${user}`);
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  // ❌ Missing params check (should never happen here, but safe)
  if (!room || !user) {
    console.log("Missing parameters — sending info page");
    return res.sendFile(path.join(__dirname, "html_error", "tetris_info.html"));
  }
 
  /// ❌ Player name already taken

  // ✅ Otherwise serve the Vue game app
  
  console.log("All good — serving dist/index.html");
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  return res.sendFile(path.join(__dirname, "dist", "index.html"));
  
});
// Fallback for unknown routes (SPA handling
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "html_error", "tetris_info.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});