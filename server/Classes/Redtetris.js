const { Socket } = require("socket.io")
const Score = require("./Score.js");

class Games {
	constructor() { 
		console.log("init class Redtetris")
		this.games = []
		this.score = new Score()
	}
	addGame(game){
		this.games.push(game)
		return
	}
	delGame(game_name){
		const filtered = this.games.filter(item => item.name !==game_name) // remove an element with specified valu
		this.games = filtered
		return
	}
	lenGame(){
		return this.games.length
	}
	checkGame(room_name){
		let ex = false
		this.games.forEach(game => {
			if (game.name == room_name) {
				ex = true
			}
		});
		return ex
	}
	getGames(){
		return this.games
	}
	getGame(room_name){
		let my_game 
		this.games.forEach(game => {
			if (game.name == room_name) {
				my_game = game
				return game
			}
		});
		return my_game
	}
	// Search a game of a determinate socket.id
	getGameBySocket(socket){
		let search_game = false
		for (let i = 0; i < this.games.length; i++) {
			console.log("searching game")
			// check if socket id is in this.sockets = []
			if (this.games[i].sockets.includes(socket)) {
				console.log("gME FOUNF")
				search_game = this.games[i]
				break
			}
		};
		return search_game
	}
	// Search a player of a determinate socket.id
	getPlayerBySocket(socket){
	}
	info(){
		return this.games
	}
	getScore(){
		return this.score
	}
}

module.exports = Games;