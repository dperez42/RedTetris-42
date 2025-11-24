const  Player  = require('../Classes/Player');
const  Redtetris  = require('../Classes/Redtetris');
const  Game = require('../Classes/Game');
const  Score = require('../Classes/Score');
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
describe('Score', function () {
    describe('init', function () {
        let score = new Score('results_test.json')
        it ('Should be able to create a Score object', function() {     
              assert.equal(JSON.stringify(score.resultsFile), JSON.stringify("/app/results_test.json"));
        });
    });
    describe('load results', function () {
        let score = new Score('results_test.json')
        //console.log(score.ranking)
        it ('Should be able to load results in a Score object', function() {     
              assert.equal(JSON.stringify(score.results), JSON.stringify([{"game":"test_room","winner":"test_player","date":"2025-11-03T18:24:05.465Z","players":[{"name":"test_playgger2","score":5},{"name":"test_plggayer10","score":3}]},{"game":"test_room2","winner":"test_player1","date":"2025-11-03T18:24:05.465Z","players":[{"name":"test_player1","score":5},{"name":"test_plggayer10","score":3}]}]));
        });
    });
    describe('get ranking', function () {
        let score = new Score('results_test.json')
        console.log(score.ranking)
        it ('Should be able to give the ranking of a Score object', function() {     
              assert.equal(JSON.stringify(score.getRanking()), JSON.stringify([{"name":"test_plggayer10","Score":6},{"name":"test_playgger2","Score":5},{"name":"test_player1","Score":5}]));
        });
    });
    describe('save result', function () {
        let score = new Score('results_test_save.json')
        const game = 
            {
                "game": "test_room",
                "winner": "test_player",
                "players": [
                  {
                    "name": "test_playgger2",
                    "score": 5
                  },
                  {
                    "name": "test_plggayer10",
                    "score": 3
                  }
                ]
              }
        it ('Should be able to save a game in a Score object', function() {     
              assert.equal(JSON.stringify(score.saveResult(game)), JSON.stringify(true));
        });
    });
   
})