const  Player  = require('../Classes/Player');
const  Redtetris  = require('../Classes/Redtetris');
const  Game = require('../Classes/Game');
var chai = require('chai');
var assert = chai.assert;

let player = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
const list_pieces = [
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 3 },
    { index_piece: 1, x: 4, y: 0, rotation: 3, color: 2 },
    { index_piece: 2, x: 4, y: 0, rotation: 0, color: 1 },
    { index_piece: 0, x: 4, y: 0, rotation: 1, color: 5 },
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 4 }
]
describe('Redtetris', function () {
    describe('init', function () {
        let redtetris = new Redtetris()
        it ('Should be able to create a Redtetris object', function() {     
              assert.equal(JSON.stringify(redtetris.games), JSON.stringify([]));
              //assert.equal(JSON.stringify(redtetris.score), JSON.stringify('odFA97e3F_mYPJ0NAAAD'));
        });
    });
    describe('Adding game to RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to add new game to a Redtetris object', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            assert.equal(JSON.stringify(redtetris.lenGame()), JSON.stringify(2));
              //assert.equal(JSON.stringify(redtetris.score), JSON.stringify('odFA97e3F_mYPJ0NAAAD'));
        });
    });
    describe('Deleting game by name to RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to delete a game from a Redtetris object', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            assert.equal(JSON.stringify(redtetris.lenGame()), JSON.stringify(2));
            redtetris.delGame('Game1');
            assert.equal(JSON.stringify(redtetris.lenGame()), JSON.stringify(1));
        });
    });
    describe('Number of games in RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to give the number of games from a Redtetris object', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            const game3 = new Game('Game3', redtetris.score) 
            const game4 = new Game('Game4', redtetris.score) 
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            redtetris.addGame(game3)
            redtetris.addGame(game4)
            assert.equal(JSON.stringify(redtetris.lenGame()), JSON.stringify(4));
        });
    });
    describe('Check if a game exist in RedTetris by name', function () {
        let redtetris = new Redtetris()
        it ('Should be able check if a game exist from a Redtetris object', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            const game3 = new Game('Game3', redtetris.score) 
            const game4 = new Game('Game4', redtetris.score) 
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            redtetris.addGame(game3)
            redtetris.addGame(game4)
            assert.equal(JSON.stringify(redtetris.checkGame('Game1')), JSON.stringify(true));
            assert.equal(JSON.stringify(redtetris.checkGame('Other')), JSON.stringify(false));
        });
    });
    describe('Get games in RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to give the games objecs in a Redtetris object', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            const game3 = new Game('Game3', redtetris.score) 
            const game4 = new Game('Game4', redtetris.score) 
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            redtetris.addGame(game3)
            redtetris.addGame(game4)
            const games = redtetris.getGames()
            const names = games.map(game => game.name);
            assert.equal(JSON.stringify(names), JSON.stringify(["Game1","Game2","Game3","Game4"]));
        });
    });
    describe('Get game by name in RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to give a games object in a Redtetris object by his name', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            const game3 = new Game('Game3', redtetris.score) 
            const game4 = new Game('Game4', redtetris.score) 
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            redtetris.addGame(game3)
            redtetris.addGame(game4)
            const game = redtetris.getGame('Game1')
            assert.equal(JSON.stringify(game.name), JSON.stringify('Game1'));
        });
    });
    describe('Get game by a socket in RedTetris', function () {
        let redtetris = new Redtetris()
        it ('Should be able to give a game object in a Redtetris object by a socket', function() {  
            const game1 = new Game('Game1', redtetris.score)   
            const game2 = new Game('Game2', redtetris.score)   
            const game3 = new Game('Game3', redtetris.score) 
            const game4 = new Game('Game4', redtetris.score) 
            redtetris.addGame(game1)
            redtetris.addGame(game2)
            redtetris.addGame(game3)
            redtetris.addGame(game4)
            game1.sockets =  ['socket1', 'socket2', 'socket3', 'socket4']
            const game = redtetris.getGameBySocket('socket1')
            assert.equal(JSON.stringify(game.name), JSON.stringify('Game1'));
            const game_no_socket = redtetris.getGameBySocket('socket13')
            assert.equal(JSON.stringify(game_no_socket), JSON.stringify(false));
        });
    });
   
})