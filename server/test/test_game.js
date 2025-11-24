const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const path = require('path');

const PORT = 4000;
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

const  Player  = require('../Classes/Player');
const  Game = require('../Classes/Game');
const  Score = require('../Classes/Score');
var chai = require('chai');
var assert = chai.assert;

let player1 = new Player(10,20,'Player1','odFA97e3F_mYPJ0NAAAD');
let player2 = new Player(10,20,'Player2','FFFFFFFFFFFFFFFFFFFF');
let player3 = new Player(10,20,'Player3','FFccccFFFFFFFFFFFFFF');
let score = new Score()
let game = new Game('Game1', score)
game.list_pieces = [
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 3 },
    { index_piece: 1, x: 4, y: 0, rotation: 3, color: 2 },
    { index_piece: 2, x: 4, y: 0, rotation: 0, color: 1 },
    { index_piece: 0, x: 4, y: 0, rotation: 1, color: 5 },
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 4 }
]
const list_pieces = [
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 3 },
    { index_piece: 1, x: 4, y: 0, rotation: 3, color: 2 },
    { index_piece: 2, x: 4, y: 0, rotation: 0, color: 1 },
    { index_piece: 0, x: 4, y: 0, rotation: 1, color: 5 },
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 4 }
]
player1.addFirstPiece(list_pieces)
player2.addFirstPiece(list_pieces)

describe('Game', function () {
    describe('init', function () {
        it ('Should be able to init a game object', function() {     
              assert.equal(JSON.stringify(game.name), JSON.stringify('Game1'));
              assert.equal(JSON.stringify(game.sockets), JSON.stringify([]));
              assert.equal(JSON.stringify(game.players), JSON.stringify([]));
              assert.equal(JSON.stringify(game.isStart), JSON.stringify(false));
              assert.equal(JSON.stringify(game.isOnePlayer), JSON.stringify(true));
              assert.equal(JSON.stringify(game.gravity), JSON.stringify(500));
              assert.equal(JSON.stringify(game.countdown), JSON.stringify(5));
        });
    });   
    describe('getter', function () {
        it ('Should be able to get info of a game object', function() {     
              assert.equal(JSON.stringify(game.getName()), JSON.stringify('Game1'));
              assert.equal(JSON.stringify(game.getSockets()), JSON.stringify([]));
              assert.equal(JSON.stringify(game.getPlayers()), JSON.stringify([]));
              assert.equal(JSON.stringify(game.getNbPieces()), JSON.stringify(5));
              assert.equal(JSON.stringify(game.getGhostMode()), JSON.stringify(false));
              assert.equal(JSON.stringify(game.info()), JSON.stringify("name of the game:Game1list of players:"));
        });
    });
    describe('add player with his socket in the game', function () {
        let game1 = new Game('Game2', score)
        game1.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game1.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')

        it ('Should be able to add a player in game object', function() {     
              assert.equal(JSON.stringify(game1.getName()), JSON.stringify('Game2'));
              assert.equal(JSON.stringify(game1.getSockets()), JSON.stringify(["odFA97e3F_mYPJ0NAAAD","FFFFFFFFFFFFFFFFFFFF"]));
              assert.equal(JSON.stringify(game1.getPlayers()), JSON.stringify([{"sizeColumn":10,"sizeRow":20,"name":"Player1","socket":"odFA97e3F_mYPJ0NAAAD","piece":{"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false},"nb_piece":1,"field":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"field_piece":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"score":0,"freeze_lines":0,"gameOver":false},{"sizeColumn":10,"sizeRow":20,"name":"Player2","socket":"FFFFFFFFFFFFFFFFFFFF","piece":{"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false},"nb_piece":1,"field":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"field_piece":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"score":0,"freeze_lines":0,"gameOver":false}]));
        });
    });
    
    describe('del player by his name in the game', function () {
        let game2 = new Game('Game2', score)
        game2.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game2.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        game2.delPlayer('Player1')
        it ('Should be able to delete a player by his name in a game object', function() {     
              assert.equal(JSON.stringify(game2.getName()), JSON.stringify('Game2'));
              assert.equal(JSON.stringify(game2.getSockets()), JSON.stringify(["odFA97e3F_mYPJ0NAAAD","FFFFFFFFFFFFFFFFFFFF"]));
              assert.equal(JSON.stringify(game2.getPlayers()), JSON.stringify([{"sizeColumn":10,"sizeRow":20,"name":"Player2","socket":"FFFFFFFFFFFFFFFFFFFF","piece":{"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false},"nb_piece":1,"field":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"field_piece":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"score":0,"freeze_lines":0,"gameOver":false}]));
        });
    });
    
    describe('del player by his socket in the game', function () {
        let game3 = new Game('Game2', score)
        game3.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game3.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        game3.delPlayerBySocket('odFA97e3F_mYPJ0NAAAD')
        it ('Should be able to delete a player by his name in a game object', function() {     
              assert.equal(JSON.stringify(game3.getName()), JSON.stringify('Game2'));
              assert.equal(JSON.stringify(game3.getSockets()), JSON.stringify(["FFFFFFFFFFFFFFFFFFFF"]));
              assert.equal(JSON.stringify(game3.getPlayers()), JSON.stringify([{"sizeColumn":10,"sizeRow":20,"name":"Player2","socket":"FFFFFFFFFFFFFFFFFFFF","piece":{"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false},"nb_piece":1,"field":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"field_piece":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"score":0,"freeze_lines":0,"gameOver":false}]));
        });
    });
    
    describe('get  player by his socket in the game', function () {
        let game4 = new Game('Game2', score)
        game4.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game4.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        it ('Should be able to get a player by his socket in a game object', function() {     
            assert.equal(JSON.stringify(game4.getPlayerBySocket('odFA97e3F_mYPJ0NAAAD')), JSON.stringify({"sizeColumn":10,"sizeRow":20,"name":"Player1","socket":"odFA97e3F_mYPJ0NAAAD","piece":{"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false},"nb_piece":1,"field":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"field_piece":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],"score":0,"freeze_lines":0,"gameOver":false}));
            assert.equal(JSON.stringify(game4.getPlayerBySocket('not_exist')), JSON.stringify(null));
        });
    });
    
    describe('check a player by his name in the game', function () {
        let game5 = new Game('Game2', score)
        game5.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game5.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        it ('Should be able to check a player by his name in a game object', function() {     
            assert.equal(JSON.stringify(game5.checkPlayer('Player1')), JSON.stringify(true));
            assert.equal(JSON.stringify(game5.checkPlayer('not_exist')), JSON.stringify(false));
        });
    });
    
    describe('set mode in the game', function () {
        let game6 = new Game('Game2', score)
        game6.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game6.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        game6.setmode(500,true)
        it ('Should be able to set de mode and ghost mode in a game object', function() {     
            assert.equal(JSON.stringify(game6.gravity), JSON.stringify(500));
            assert.equal(JSON.stringify(game6.getGhostMode()), JSON.stringify(true));
        });
    });
    
    describe('init countdown in the game', function () {
        let game12 = new Game('Game2', score)
        game12.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        game12.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        game12.setmode(500,true)
        game12.startCountdown(io)
        it ('Should be able to set de mode and ghost mode in a game object', function() {     
            assert.equal(JSON.stringify(game12.isCountdown), JSON.stringify(true));
        });
    });
    describe('send update the game', function () {
        it ('Should be able to send message update', function() {  
            let actual_object =  game.sendUpdate(io)  
            // Elimino el ranking pues varia 
            delete actual_object.data.ranking
            let expected_object = {"command":"update","data":{"name":"Game1","players":[],"list_pieces":[{"index_piece":6,"x":4,"y":0,"rotation":1,"color":3},{"index_piece":1,"x":4,"y":0,"rotation":3,"color":2},{"index_piece":2,"x":4,"y":0,"rotation":0,"color":1},{"index_piece":0,"x":4,"y":0,"rotation":1,"color":5},{"index_piece":6,"x":4,"y":0,"rotation":1,"color":4}],"ranking":[{"name":"test_player2","Score":15},{"name":"test_player10","Score":9},{"name":"test_player","Score":6},{"name":"test_playgger2","Score":5},{"name":"test_plggayer10","Score":3},{"name":"test_player3","Score":0}],"isStart":false,"isFinish":false,"winner":null,"winner_socket":null,"gravity":500,"isCountdown":false,"countdown":5,"isPause":false,"isOnePlayer":true}}
            delete expected_object.data.ranking
            //console.log(expected_object)
            assert.deepEqual(actual_object, expected_object);
        });
    });
    describe('set pause', function () {
        let gamePause = new Game('Game2', score)
        gamePause.pause()
        it ('Should be able to set pause', function() {     
            assert.equal(JSON.stringify(gamePause.isPause), JSON.stringify(true));
        });
    });
    describe('start game', function () {
        let gameStart = new Game('Game2', score)
        gameStart.list_pieces = [
            { index_piece: 6, x: 4, y: 0, rotation: 1, color: 3 },
            { index_piece: 1, x: 4, y: 0, rotation: 3, color: 2 },
            { index_piece: 2, x: 4, y: 0, rotation: 0, color: 1 },
            { index_piece: 0, x: 4, y: 0, rotation: 1, color: 5 },
            { index_piece: 6, x: 4, y: 0, rotation: 1, color: 4 }
        ]
        gameStart.addPlayer(player1,'odFA97e3F_mYPJ0NAAAD')
        gameStart.addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        gameStart.setmode(500,true)
        it ('Should be able to start game', function() {     
            assert.equal(JSON.stringify(gameStart.start(Math.random(),io)), JSON.stringify(true));
            assert.equal(JSON.stringify(gameStart.isStart), JSON.stringify(true));
        });
    });
    
    describe('reinit the game', function () {
        let gameInint = new Game('GameInit', score)
        gameInint .addPlayer(player3,'odFA97e3F_mYPJ0NAAAD')
        //gameInint .addPlayer(player2,'FFFFFFFFFFFFFFFFFFFF')
        gameInint .setmode(500,true)
        gameInint .isStart=true
        gameInint .init(io)
        it ('Should be able to reinit the game object', function() {     
            assert.equal(JSON.stringify(gameInint.isStart), JSON.stringify(false));
        });
    });
    
})