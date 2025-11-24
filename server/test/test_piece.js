const  Piece  = require('../Classes/Piece');
var chai = require('chai');
var assert = chai.assert;

let piece = new Piece();
const list_pieces = [
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 3 },
    { index_piece: 1, x: 4, y: 0, rotation: 3, color: 2 },
    { index_piece: 2, x: 4, y: 0, rotation: 0, color: 1 },
    { index_piece: 0, x: 4, y: 0, rotation: 1, color: 5 },
    { index_piece: 6, x: 4, y: 0, rotation: 1, color: 4 }
]
const field_piece = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
const field_piece_collision = [
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
describe('Piece', function () {
	describe('init', function () {
	  it ('Should be able to init a piece', function() {
          
			assert.equal(JSON.stringify(piece.x), JSON.stringify(4));
            assert.equal(JSON.stringify(piece.y), JSON.stringify(0));
            assert.equal(JSON.stringify(piece.penalty_lines), JSON.stringify(0));
            assert.equal(JSON.stringify(piece.GameOver), JSON.stringify(false));
	  });
	});
    describe('create first piece from a list', function () {
        let piece1 = new Piece();
        piece1.firstPiece(list_pieces)
        it ('Should be able to get the first piece from a list', function() {
            assert.equal(JSON.stringify(piece1.index_piece), JSON.stringify(list_pieces[0].index_piece));
			assert.equal(JSON.stringify(piece1.x), JSON.stringify(list_pieces[0].x));
            assert.equal(JSON.stringify(piece1.y), JSON.stringify(list_pieces[0].y));
            assert.equal(JSON.stringify(piece1.rotation), JSON.stringify(list_pieces[0].rotation));
            assert.equal(JSON.stringify(piece1.color), JSON.stringify(list_pieces[0].color));
	  });
    });
    describe('create random piece ', function () {
        let piece2  = new Piece();
        piece2.newPiece()
        it ('Should be able to get the first piece from a list', function() {
            assert.equal(JSON.stringify(piece2.nb_piece), JSON.stringify(1));
			assert.equal(JSON.stringify(piece2.x), JSON.stringify(4));
            assert.equal(JSON.stringify(piece2.y), JSON.stringify(0));
            assert.equal(JSON.stringify(piece2.penalty_lines), JSON.stringify(0));
            assert.equal(JSON.stringify(piece2.GameOver), JSON.stringify(false));
	    });
    });
    describe('check if Collision', function () {
        let piece3  = new Piece();
        piece3.newPiece()
        it ('Should be able check if Collision', function() {
            assert.equal(JSON.stringify(piece3.checkCollision(field_piece)), JSON.stringify(false));
            assert.equal(JSON.stringify(piece3.checkCollision(field_piece_collision)), JSON.stringify(true));
	  });
    });
    describe('clearlines', function () {
        let piece4  = new Piece();
        piece4.GameOver=false
        piece4.color=1
        piece4.data=[[0, 1, 0],[0, 1, 1],[0, 0, 1]]
        piece4.height=3
        piece4.index_piece=4
        piece4.nb_piece=7
        piece4.penalty_lines=0
        piece4.rotation=1
        piece4.score=0
        piece4.width=3
        piece4.x=0
        piece4.y=17
        it ('Check clear lines', function() {
            assert.equal(JSON.stringify(piece.clearlines(field_piece_collision,0)), JSON.stringify(1));
            assert.equal(JSON.stringify(piece.clearlines(field_piece_collision,1)), JSON.stringify(0));
        })
    }); 
    describe('getters', function () {
        it ('Check getters', function() {
            assert.equal(JSON.stringify(piece.getNb_piece()), JSON.stringify(1));
            assert.equal(JSON.stringify(piece.getScore()), JSON.stringify(0));
            assert.equal(JSON.stringify(piece.getGameOver()), JSON.stringify(false));
            assert.equal(JSON.stringify(piece.getPenaltyLines()), JSON.stringify(0));
        });
    }); 
    describe('moving piece x', function () {
        let piece10  = new Piece();
        piece10.newPiece(0,0) //test with horizontal bar
        it ('Should be able to move the piece x', function() {
            piece10.right(field_piece)
            assert.equal(JSON.stringify(piece10.x), JSON.stringify(5));
	    });
        it ('Should be able to move the piece x. + out limits', function() {
            piece10.right(field_piece)
            piece10.right(field_piece)
            piece10.right(field_piece)
            piece10.right(field_piece)
            assert.equal(JSON.stringify(piece10.x), JSON.stringify(6));
	    });
        it ('Should be able to move the piece x. - out limits', function() {
            piece10.x=0
            piece10.left(field_piece)
            assert.equal(JSON.stringify(piece10.x), JSON.stringify(0));
	    });
    });
    describe('moving piece y', function () {
        let piece11  = new Piece();
        piece11.newPiece() //get first piece 
        it ('Should be able to move the piece y +1', function() {
            piece11.softDrop(field_piece)
            assert.equal(JSON.stringify(piece11.y), JSON.stringify(1));
	    });
    });
});