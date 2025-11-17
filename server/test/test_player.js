const  Player  = require('../Classes/Player');
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
describe('Player', function () {
    describe('init', function () {
        it ('Should be able to init a player', function() {     
              assert.equal(JSON.stringify(player.name), JSON.stringify('Daniel'));
              assert.equal(JSON.stringify(player.socket), JSON.stringify('odFA97e3F_mYPJ0NAAAD'));
              assert.equal(JSON.stringify(player.sizeColumn), JSON.stringify(10));
              assert.equal(JSON.stringify(player.sizeRow), JSON.stringify(20));
              assert.equal(JSON.stringify(player.nb_piece), JSON.stringify(1));
              assert.equal(JSON.stringify(player.score), JSON.stringify(0));
              assert.equal(JSON.stringify(player.freeze_lines), JSON.stringify(0));
        });
    });
    describe('reinit', function () {
        it ('Should be able to reinit a player', function() {     
            let player1 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player1.nb_piece = 10
            player1.score = 1000
            player1.freeze_lines = 100
            //console.log(player1)
            player1.init()
            assert.equal(JSON.stringify(player1.name), JSON.stringify('Daniel'));
            assert.equal(JSON.stringify(player1.socket), JSON.stringify('odFA97e3F_mYPJ0NAAAD'));
            assert.equal(JSON.stringify(player1.sizeColumn), JSON.stringify(10));
            assert.equal(JSON.stringify(player1.sizeRow), JSON.stringify(20));
            assert.equal(JSON.stringify(player1.nb_piece), JSON.stringify(1));
            assert.equal(JSON.stringify(player1.score), JSON.stringify(0));
            assert.equal(JSON.stringify(player1.freeze_lines), JSON.stringify(0));
        });
    });
    describe('add frist piece', function () {
        it ('Should be able to get first piece of the list', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            assert.equal(JSON.stringify(player2.piece), JSON.stringify({"index_piece":6,"x":4,"y":0,"rotation":1,"width":3,"height":3,"data":[[0,0,1],[0,1,1],[0,1,0]],"color":3,"nb_piece":1,"score":0,"penalty_lines":0,"GameOver":false}));
        });
    });
    describe('move pieces', function () {
        it ('Should be able to move current piece: left', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece('ArrowLeft',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,3,0,0,0,0],[0,0,0,0,3,3,0,0,0,0],[0,0,0,0,3,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
        it ('Should be able to move current piece: right', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece('ArrowRight',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,3,0,0],[0,0,0,0,0,0,3,3,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
        it ('Should be able to move current piece: rotate left', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece('ArrowUp',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,3,3,0,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
        it ('Should be able to move current piece: soft drop', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece('ArrowDown',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,3,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
        it ('Should be able to move current piece: hard drop', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece(' ',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,3,0,0,0,0]]));
        });
        it ('Should be able to move current piece: hard drop', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece(' ',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,3,0,0,0,0]]));
        });
        it ('Should be able to move current piece: gravity', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.movePiece('down',1,list_pieces,false) //DROP
            assert.equal(JSON.stringify(player2.field_piece, false), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,3,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
    });
    describe('merge', function () {
        it ('Should be able to merge a piece in the board, ghost_mode false', function() {     
            let player2 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player2.addFirstPiece(list_pieces)
            player2.merge(false)
            assert.equal(JSON.stringify(player2.field_piece), JSON.stringify([[0,0,0,0,0,0,3,0,0,0],[0,0,0,0,0,3,3,0,0,0],[0,0,0,0,0,3,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
        it ('Should be able to merge a piece in the board, ghost_mode true', function() {     
            let player3 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player3.addFirstPiece(list_pieces)
            player3.piece.y = 5 // move piece to  ghost zone
            player3.merge(true)
            assert.equal(JSON.stringify(player3.field_piece), JSON.stringify([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]));
        });
    });
    describe('getters', function () {
        it ('Check getters of player', function() {     
            let player1 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player1.nb_piece = 10
            player1.score = 1000
            player1.penalty_lines = 100
            assert.equal(JSON.stringify(player1.getNbpiece()), JSON.stringify(10));
            assert.equal(JSON.stringify(player1.getStatusPlayer()), JSON.stringify(false));
            assert.equal(JSON.stringify(player1.getPenaltyLines()), JSON.stringify(100));
        });
    });
    describe('add freeze line', function () {
        it ('Check Increment freeze lines of player', function() {     
            let player1 = new Player(10,20,'Daniel','odFA97e3F_mYPJ0NAAAD');
            player1.freeze_lines = 100
            player1.addFreezeLines(10)
            assert.equal(JSON.stringify(player1.freeze_lines), JSON.stringify(110));
        });
    });
})