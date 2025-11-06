// npm start
// https://github.com/Ysrbolles/Red-tetris-42Network/blob/main/index.js
// https://github.com/sawyerf/red-tetris/blob/main/back/utils/Game.ts

const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const path = require('path');
const Redtetris = require("./Classes/Redtetris.js");
const Game = require("./Classes/Game.js");
const Piece = require("./Classes/Piece.js");
const Player = require("./Classes/Player.js");
const fs = require ('fs')
const dotenv = require('dotenv');

// INIT REDTETRIS
let redtetris = new Redtetris()

// get config vars
dotenv.config({path: __dirname + '/.env'})
//console.log(process.env)
const PORT = process.env.SERVER_PORT || 1337;
console.log(PORT)

const app = express();
const server = http.createServer(app);

// Define CORS
var corsOptions = {
  origin: "http://localhost:8080"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(__dirname + "/../client/dist/"));a
// directory to serve files
//app.use('/assets', express.static(path.join(__dirname + '/../public/assets')));
app.use(express.static(path.join(__dirname, "html_error")));      // html errors
app.use(express.static(path.join(__dirname, "dist")));   // Aplication directory

app.disable('etag') //disable etag to avoid 304 during development

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
  const data = {
      'command':'info',
      'data': "CONNECTED TO SERVER"
  }
  socket.emit('red_tetris_client',data)
  try {
      socket.sendBuffer = [];
      console.log("Client Connected From", socket.handshake.headers.referer, socket.id);
      //console.log("Client Connected From", socket, socket.id);
  } catch (e) {
      console.log(e.message);
  }
  socket.on("red_tetris_server", async (data) => {
    //console.log("msg recieved in red-tetris server from ",socket.id,".",data)  
    if (data.command==='join'){
        //console.log("exist game?", data.roomName)
        const room_exists =  redtetris.checkGame(data.roomName)
        //console.log(room_exists)
        // Check if Game exists?
        if (!room_exists){
          console.log("creating game.", data.roomName)
          const game = new Game(data.roomName, redtetris.getRanking())
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
    //console.log("send end")
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


// Sending app by index.html

//app.get('/', (req, res) => {
  //console.log("paframeters:")//, req)
   //req.params={}
   //console.log("redirect", req.params)
  /*
  console.log("Lrrrl")
  console.log(req)
  const file = '/../client/dist/index.html'
  fs.readFile(__dirname + file, (err, data) => {
			if (err) {
				console.log(err)
				res.writeHead(500)
				return res.end('Error loading index.html')
			}
			res.writeHead(200)
			res.end(data)
		})
  */
  //res.send({"success":true, "msg":"join to game"});
  /*
  const options = {
    root: path.join(__dirname, '/../client/dist/'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'Content-Type': 'html',
      'Cache-Control':'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires':0
    }
  }
  const fileName = 'index.html'
   res.sendFile(fileName, options, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
});
*/
// this send back the game page /// 
app.get("/:room/:user", (req, res) => {
  const params = req.params;
  console.log("Parameters:", params);
  console.log("Number of parameters:", Object.keys(params).length);
  console.log(path.resolve(__dirname, "dist", "index.html"));
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  
});

// Catch-all for other routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "html_error", "user_name.html"));
});
/*
app.get("/:user/:pp", (req, res, next) => {
  console.log("params",req.params.pp, req.params.user)
    // do the checks of rooms and player in join(socket)

  //const filePath = path.join(__dirname, '/../public/')
  const filePath = path.join(__dirname, '/../public/')
  console.log(filePath)
    res.sendFile(filePath + 'index.html', 
      {headers: {
        //'Content-Type': 'text/html',
        //'Cache-Control':' no-cache, no-store,must-revalidate',
        //'Pragma': 'no-cache',
        //'Expires':0
      }}, (err) => {
        if (err) {
          console.log(err)
          res.writeHead(500)
          return res.end('Error loading index.html')
        }
      })
});
app.get("/game_started", (req, res) => {
  //res.sendFile(path.join(__dirname, "html_error", "game_started.html"));
  res.sendFile(path.join(__dirname, "html_error", "user_name.html"));
});
*/

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});