const Piece = require("./Piece.js");
const fs = require("fs");
const path = require("path");

class Game {
	constructor(name, score) { 
		//console.log("init class Game")
		this.name = name
		this.sockets = []
		this.players = []
		// add pieces to list this.list_pieces = []
		//console.log(` creating initial list of pieces ...`);
		this.list_pieces = []
		this.addPieces(20)
		this.score = score
		this.isStart = false
		this.isFinish = false
		this.isCountdown = false
		this.isPause = false
		this.isOnePlayer = true
		this.winner = null
		this.winner_socket = null
		this.intervalGame = null
		this.gravity = 500
		this.ghost_mode = false
		this.countdown = 5
		this.intervalCountdown = null
	}

	gamelogic(io){
		//console.log("exec game logic")
		// check if pause
		if (!this.isPause){
			let nb_online_players = 0 
			// move pieces
			this.players.forEach(player => {
				player.movePiece('down', 1, this.list_pieces, this.ghost_mode)
			});
			this.players.forEach(player => {
				// check list of pieces if more pieces are needed
				if (player.getNbpiece()>this.list_pieces.length-10){
					this.addPieces(20)
				}
				// get penalty lines and set to the other players
				const lines = player.getPenaltyLines()
				if (lines>0){
					// add penalty lines to thres users
					//console.log("pppppppenalty")
					this.players.forEach(player2 => {
						if (player.socket !== player2.socket){
							player2.addFreezeLines(lines)
						}
					})
				}
				// numbers of player gameover
				console.log("checking status", player.getStatusPlayer())
				if (!player.getStatusPlayer()){
					nb_online_players++
					this.winner = player.name
					this.winner_socket = player.socket
				}
				
			});
			// check if is a several players game o one player game
			if (this.isOnePlayer){
				if (nb_online_players===0) {
					clearInterval(this.intervalGame)
					this.isFinish = true
					this.sendUpdate(io)
				}
			} else {
				if (nb_online_players === 1){
					clearInterval(this.intervalGame)
					// set game to finish and load results and comunicate finish to all 
					this.isFinish = true
					// Save results
					const result = {
						game: this.name,
						winner: this.winner,
						players: this.players
					};
					// only save results in varios players
					this.score.saveResult(result)
					// to display pop up 
					this.sendUpdate(io)
				}
			}		
			// send update
			this.sendUpdate(io)
		} else {
			this.sendUpdate(io)
		}
	}
	sendUpdate(io){
		const data ={}
				data.name =this.name
				//data.sockets = this.sockets 
				data.players = this.players
				data.list_pieces = this.list_pieces 
				data.ranking = this.score.getRanking() 
				data.isStart = this.isStart 
				data.isFinish = this.isFinish
				data.winner = this.winner 
				data.winner_socket = this.winner_socket
				//data.intervalGame = this.intervalGame 
				data.gravity = this.gravity 
				data.isCountdown = this.isCountdown 
				data.countdown = this.countdown 
				data.isPause  = this.isPause
				data.isOnePlayer = this.isOnePlayer
				//data.intervalCountdown = this.intervalCountdown 
				const msg = {
					'command':'update',
					'data': data
				}
		this.sockets.forEach(socketId => {
			const socket = io.sockets.sockets.get(socketId);
			if (socket) {
				//console.log(data)
				socket.emit('red_tetris_client', msg);
			} else {
			  console.warn(`Socket not found: ${socketId}`);
			}
		});
		return msg
	}
	start(seed,io){
		console.log(` starting game with seed ${seed} ...`);
		this.isStart = true
		// send message of start
		// 🔥 Send update to each socket in this.sockets
		this.sockets.forEach(socketId => {
			const socket = io.sockets.sockets.get(socketId);
			if (socket) {
				console.log(`sending ${socket}`)
				const msg = {
					'command':'start',
					'isStart': this.isStart,
				  }
				socket.emit('red_tetris_client', msg);
			} else {
			  console.warn(`Socket not found: ${socketId}`);
			}
		});
		// add first piece to all
		//console.log(this.list_pieces)
		this.players.forEach(player => {
			player.addFirstPiece(this.list_pieces)
		});
		// send update
		this.sendUpdate(io)

		// start interval of game logic
		console.log("starting game",this.gravity)
		this.intervalGame = setInterval(() => {
			//this.countGame--
			console.log("difficult", this.gravity)
			this.gamelogic(io)
		},this.gravity)
		return true
	}
	pause(){
		console.log("game pause")
		this.isPause = !this.isPause
	}
	init(io){
		clearInterval(this.intervalGame)
		/// init game general data
		console.log("reinit Game")
		this.isStart = false
		this.intervalGame = null
		this.isCountdown = false
		this.isPause = false
		this.countdown = 5
		this.intervalCountdown = null
		/// init players
		this.players.forEach(player => {
			// init player
			player.init()
			// add first piece
			player.addFirstPiece(this.list_pieces)
		});
		// send update
		this.sendUpdate(io)
	}
	setmode(mode, ghost_mode){
		this.gravity=mode,
		this.ghost_mode=ghost_mode
	}
	startCountdown(io){
		console.log(`Countdown of ${this.name}: ${this.countdown}`);
		if (this.isCountdown) return; // evita múltiples countdowns
		this.isCountdown = true
		this.intervalCountdown = setInterval(() => {
			this.countdown--;
			console.log(`Countdown of ${this.name}: ${this.countdown}`);
			// Aquí podrías mando update a los jugadores
			// 🔥 Send update to each socket in this.sockets
			this.sockets.forEach(socketId => {
				const socket = io.sockets.sockets.get(socketId);
				if (socket) {
					console.log(`sending ${socket}`)
					const msg = {
						'command':'countdown',
						'isCountdown': this.isCountdown,
						'countdown':this.countdown
					  }
					socket.emit('red_tetris_client', msg);
				} else {
				  console.warn(`Socket not found: ${socketId}`);
				}
			  });
			if (this.countdown <= 0) {
			  clearInterval(this.intervalCountdown);
			  this.intervalCountdown = null;
			  this.isCountdown = false
			  this.countdown = 5;
			  console.log(`Countdown of ${this.name} finished...`);
			  // 🔥 Send update to each socket in this.sockets
				this.sockets.forEach(socketId => {
					const socket = io.sockets.sockets.get(socketId);
					if (socket) {
						console.log(`sending ${socket}`)
						const msg = {
							'command':'countdown',
							'isCountdown': this.isCountdown,
							'countdown': this.countdown
						}
						socket.emit('red_tetris_client', msg);
					} else {
					console.warn(`Socket not found: ${socketId}`);
					}
				});
			  // 🔥 start game
			  this.start(Math.random(),io); // o pasa un seed real
			}
		  }, 1000);
		  return true
	}
	checkPlayer(player_name){
		let ex = false
		this.players.forEach(player => {
			if (player.name == player_name) {
				ex = true
			}
		});
		return ex
	}
	//add player to game
	addPlayer(player, socket){
		// Add player in players[]
		this.players.push(player)
		// Add player socket in sockets[]
		this.sockets.push(socket)
		if (this.players.length>1){
			this.isOnePlayer=false
		}
		return
	}
	//delete a player from a game by name
	delPlayer(player_name){
		// Delete player by name in players[]
		const filtered = this.players.filter(item => item.name !==player_name) // remove an element with specified valu
		this.players = filtered
		return
	}
	//get player by socket_id
	getPlayerBySocket(socket_id){
		for (let i = 0; i < this.players.length; i++){
			if (this.players[i].socket === socket_id) return this.players[i]
		}
		return null
	}
	//delete a player from a game by socket.id (in player list and socket list)
	delPlayerBySocket(socket){
		// Delete player by socket in players[]
		const filtered = this.players.filter(item => item.socket !== socket) // remove an element with specified valu
		this.players = filtered
		// Delete player socket in socket[]
		const filtered_sockets = this.sockets.filter(item => item !== socket)
		this.sockets = filtered_sockets
		// check if only one -> set this.isOnePlayer = true
		if (this.sockets.length === 1){
			this.isOnePlayer = true
		}
		return
	}
	addPieces(nb){
		for (let i = 0; i < nb; i++) {
			const piece = {}
			piece.index_piece = Math.floor(Math.random() * 7);
			piece.x = 4
			piece.y = 0
			piece.rotation = Math.floor(Math.random() * 4)
			piece.color = 1 + Math.floor(Math.random() * 5)
			this.list_pieces.push(piece)
			//console.log("añado piece a game")
			//piece.print()
		}
		//console.log("list of pieces")
		//console.log(this.list_pieces)
	}
	/// getters
	info(){
		//console.log("name of the game:",this.name, "list of players:",this.players)
		return ("name of the game:"+this.name+ "list of players:"+this.players)
	}
	getPlayers(){
		return this.players
	}
	getName(){
		return this.name
	}
	getSockets(){
		return this.sockets
	}
	getNbPieces(){
		return this.list_pieces.length	
	}
	getGhostMode(){
		return this.ghost_mode
	}
}

module.exports = Game;