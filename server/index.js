const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const path = require('path');
const Redtetris = require("./Classes/Redtetris.js");
const Game = require("./Classes/Game.js");
const Player = require("./Classes/Player.js");
const dotenv = require('dotenv');

// Init Object REDTETRIS
let redtetris = new Redtetris()

// Get config vars from .env
dotenv.config({path: __dirname + '/.env'})
//console.log(process.env)
const PORT = process.env.SERVER_PORT || 3000;
const DEBUG = process.env.DEBUG || 'false';
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
  if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Client Connected From", socket.handshake.headers.referer, socket.id)};
  if (process.env.DEBUG==='false'){
    const url_data = socket.handshake.headers.referer.split('/')
    // check parameters
    if (url_data.length !== 5){
      let msg = {
        'command':'error',
        'data': "NOT PARAMETERS"
      }
      socket.emit('red_tetris_client',msg)
      if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Error parameters:", url_data)}
      param_check = false
      return
    }
    if (param_check) {
      const roomName = url_data[3]
      const playerName =url_data[4]
      console.log("IO: Parameters:", roomName, playerName)
      const room_exists =  redtetris.checkGame(roomName)
        // Check if Game exists?

        if (!room_exists){
          console.log("IO: creating game.", roomName)
          const game = new Game(roomName, redtetris.getScore())
          console.log("IO: Player:", playerName, " init Room:", roomName)
          const player = new Player(10,20, playerName,socket.id)
          game.addPlayer(player, socket.id) // quito este array socketid
          redtetris.addGame(game)
          // send update msg to all player in the game
          msg = {
              'command':'error',
              'data': "OK"
          }
          socket.emit('red_tetris_client',msg)
          game.sendUpdate(io)
        } else {
          // search game by name
          console.log('IO: Game ', roomName," exist.")
          
          const game = redtetris.getGame(roomName)
          // ❌ First Check if game is finish ------------------------------------------
          if (game.isFinish) {
            console.log("IO: Game is finished  no join SEND A MSG");                   ///////////////////////////////// send error msg   
            msg = {
              'command':'error',
              'data': "GAME FINISHED"
            }
            socket.emit('red_tetris_client',msg)
            return
          }
          // ❌ Second check if game is started or in a countdown
          if (game.isStart || game.isCountdown){
            console.log("IO: Game started NO JOIN SEND A MSG");                   ///////////////////////////////// send error msg   
            msg = {
              'command':'error',
              'data': "GAME STARTED"
            }
            socket.emit('red_tetris_client',msg)
            return
          }
          
          // ❌ Check Player name already taken
          const check_player = game.checkPlayer(playerName)
          if (!check_player) {
            console.log("IO: Player:", playerName, " join to Room:", roomName)
            const player = new Player(10,20, playerName,socket.id)
            game.addPlayer(player, socket.id)
            //game.info()
            // send update msg to all player in the game
            msg = {
              'command':'error',
              'data': "OK"
            }
            socket.emit('red_tetris_client',msg)
            game.sendUpdate(io)
          } else {
            console.log("IO: Player:", playerName, " already in Room:", roomName) //////////////////////////////// send error msg   
            msg = {
              'command':'error',
              'data': "WRONG USER"
            }
            socket.emit('red_tetris_client',msg)
            return
          }
        }
    }
  }
  // 
  socket.on("red_tetris_server", async (data) => {
    if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: msg recieved in red-tetris server from ",socket.id,".",data)}
    // Join Command
    if (data.command==='join'){
        // Check if room Name exits?
        const room_exists =  redtetris.checkGame(data.roomName)
        if (!room_exists){
          if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Room no exist, creating game.", data.roomName, "with player: ", data.playerName)}
          // Create Game
          const game = new Game(data.roomName, redtetris.getScore())
          // Create first Player
          const player = new Player(10,20, data.playerName,socket.id)
          game.addPlayer(player, socket.id) // quito este array socketid
          redtetris.addGame(game)
          // send update msg to all players in the game
          game.sendUpdate(io)
        } else {
          if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Room exist.", data.roomName)}
          // Get the Game Object
          const game = redtetris.getGame(data.roomName)
          //❌ Check if Player name already taken
          const check_player = game.checkPlayer(data.playerName)
          if (!check_player) {
            if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Player:", data.playerName, " join to Room:", data.roomName)}
            const player = new Player(10,20, data.playerName,socket.id)
            game.addPlayer(player, socket.id)
            game.info()
            // send update msg to all player in the game
            game.sendUpdate(io)
          } else {
            if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Player:", data.playerName, " already in Room:", data.roomName)}
          }
          // ❌ Game is started or in countdown
          if (game.isStart || game.isCountdown){
            if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Game started NO JOIN SEND A MSG")};
          }
        }
        
    }
    // Start Command
    if (data.command==='start'){
      if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Recieve startCountdown", data.gameName)}
      // search game by name
      const game = redtetris.getGame(data.gameName)
      if (!game) {
        console.error("INDEX: IO: Game not found:", data.gameName)
        socket.emit('error', { message: 'game_not_found', gameName: data.gameName })
        return
      }
      game.setmode(data.mode, data.ghost_mode)
      //console.log("IO: game",game)
      game.startCountdown(io)      
    }
    // Pause Command
    if (data.command==='pause'){
      if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Recieve pause", data.gameName)}
      // search game by name
      const game = redtetris.getGame(data.gameName)
      if (!game) {
        console.error("INDEX: IO: Game not found:", data.gameName)
        socket.emit('error', { message: 'game_not_found', gameName: data.gameName })
        return
      }
      game.pause()      
    }
    // Restart Command
    if (data.command==='restart'){
      if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Recieve restart", data.gameName)}
      // search game by name
      const game = redtetris.getGame(data.gameName)
      if (!game) {
        console.error("INDEX: IO: Game not found:", data.gameName)
        socket.emit('error', { message: 'game_not_found', gameName: data.gameName })
        return
      }
      game.init(io)      
    }
    // Move Command
    if (data.command==='move'){
      if (process.env.DEBUG=== 'true') {console.log("NDEX: IO: Recieve move", data)}
      // search game by name
      const game = redtetris.getGame(data.gameName)
      if (!game) {
        console.error("INDEX: IO: Game not found:", data.gameName)
        socket.emit('error', { message: 'game_not_found', gameName: data.gameName })
        return
      }
      const ghost_mode = game.getGhostMode()
      const player = game.getPlayerBySocket(data.playerSocket)
      if (!player) {
        console.error("INDEX: IO: Player not found:", data.playerSocket)
        socket.emit('error', { message: 'player_not_found', playerSocket: data.playerSocket })
        return
      }
      player.movePiece(data.move,1,[],ghost_mode)
      // send update msg to all players in the game
      game.sendUpdate(io)
    }
  });
  socket.on("disconnect", () => {
    if (process.env.DEBUG=== 'true') {console.log("INDEX: IO: Socket disconnect",socket.id)}
    const game = redtetris.getGameBySocket(socket.id)
    if (game){
      // delete player with socket look in all games 
      game.delPlayerBySocket(socket.id)
      // send update msg to all player in the game
      game.sendUpdate(io)
    }
  });
});

// Disable etag to avoid 304 during development
app.disable('etag')

// Static files FIRST (before routes), dist: client file, and html_errors
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
  if (process.env.DEBUG=== 'true') {console.log("INDEX: API: Incoming request:", req.path)};
  next();
});

// Dynamic route for room/user
app.get("/:room/:user", (req, res) => {
  const { room, user } = req.params;
  if (process.env.DEBUG=== 'true') {console.log(`INDEX: API: Request: room=${room}, user=${user}`)};
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  // ❌ Missing params check (should never happen here, but safe)
  if (!room || !user) {
    if (process.env.DEBUG=== 'true') {console.log("INDEX: API: Missing parameters — sending info page")};
    return res.sendFile(path.join(__dirname, "html_error", "tetris_info.html"));
  }
  // 1 second delay
  setTimeout(function() {
  //console.log("Executed after 1 second");
  }, 1000);
  // ✅ serve the Vue game app give socket to check username, start game, etcc
  if (process.env.DEBUG=== 'true') {console.log("INDEX: API: All good — serving dist/index.html")};
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  return res.sendFile(path.resolve(__dirname, "dist","index.html"));
  //return res.sendFile(path.resolve(__dirname, "html_error", "tetris_info.html"));
  
});

// Fallback for unknown routes (SPA handling
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "html_error", "tetris_info.html"));
});

// Init Server
server.listen(PORT, () => {
  if (process.env.DEBUG=== 'true') {console.log(`INDEX: Server is running on port ${PORT} in`, process.env.SERVER_PORT === 'true' ? 'deveopment mode':'production mode')};
});