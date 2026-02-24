const tetriminios = require('./tetriminios.json');

class ClassTipo {
    constructor() {
		this.index_piece = 0
		this.x = 4
		this.y = 0
		this.rotation = 0
		this.width = 0
		this.height = 0
		this.data = []
		this.color = 1
		this.nb_piece = 1
		this.score = 0
		this.penalty_lines = 0 // number of lines to penalt others players
		this.GameOver = false
	}
	// Get first piece from the list and init 
	firstPiece(list_pieces){
		this.index_piece = list_pieces[0].index_piece;
		this.x = list_pieces[0].x
		this.y = list_pieces[0].y
		this.rotation = list_pieces[0].rotation
		this.color = list_pieces[0].color
		this.width =  tetriminios[this.index_piece].rotation[this.rotation][0].length
		this.height = tetriminios[this.index_piece].rotation[this.rotation].length
		this.data = tetriminios[this.index_piece].rotation[this.rotation]
		this.color = list_pieces[0].color
		this.nb_piece = 1
		this.score = 0
		this.penalty_lines = 0
		this.GameOver = false
	}
	// Get random piece
	newPiece (ind = Math.floor(Math.random() * 7), rot = Math.floor(Math.random() * 4)) {
		this.index_piece = ind;
		this.x = 4
		this.y = 0
		this.rotation = rot
		this.width =  tetriminios[this.index_piece].rotation[this.rotation][0].length
		this.height = tetriminios[this.index_piece].rotation[this.rotation].length
		this.data = tetriminios[this.index_piece].rotation[this.rotation]
		this.color = 1 + Math.floor(Math.random() * 4)
		this.nb_piece = 1
		this.score = 0
		this.penalty_lines = 0
		this.GameOver = false
	}
	// Check if game over
	checkGameOver(field) {
		for (let row = 0; row < this.height; row++) {
			for (let col = 0; col < this.width; col++) {
				if (this.data[row][col] !== 0) {  // piece has a block
					const y = this.y + row;
					const x = this.x + col;
					if (field[y][x] !== 0) {
						// There's already a block at the spawn position
						return true;
					}
				}
			}
		}
		return false; // No collision → game can continue
	}
	// Check if collision
	checkCollision(field){
		for (let row = 0; row < this.height; row++) {
			for (let col = 0; col < this.width; col++) {
				// Si la celda de la pieza actual está vacía, no hay que verificar colisión
				if (this.data[row][col] === 0) continue;
				const newY = this.y + row 
				const newX = this.x + col 
				// 🔹 Comprobar colisión con los bordes
				if (newY >= field.length || newY < 0 || newX < 0 || newX >= field[0].length){
					return true; // fuera del tablero
				}
				// 🔹 Comprobar colisión con una celda ocupada
				if (field[newY][newX] !== 0) {
					return true;
				}
			}
		}
		return false
	}
	// Clear lines if completed and not freeze
	clearlines(field, freeze_lines){
		let linesCleared = 0;
		let check = 1
		while (check===1){
			check = 0
			for (let y = field.length - 1 - freeze_lines; y >= 0; y--) {
				if (field[y].every(cell => cell !== 0)) {
				field.splice(y, 1); // remove row at y
				field.unshift(Array(field[0].length).fill(0)); // add empty row at top
				linesCleared++;
				check=1
				}
			}
		}
		return linesCleared;	
	}
	// set piece in field and get new one
	addPieceToField(field, list_pieces){
		for (let i = this.y; i < this.y + this.height; i++){
			for (let j = this.x; j < (this.x +  this.width); j++){
			   //// solo pinta lo que esta dentro de los limites
			   if ((i >=0 & i <20) & (j>=0 & j <10)){
				   if (this.data[i-this.y][j-this.x]===1){
					   field[i][j]=this.color;
				   }
			   }
			}
		}
		// give me new piece from list ------------ 
		this.index_piece = list_pieces[this.nb_piece].index_piece;
		this.x = list_pieces[this.nb_piece].x
		this.y = list_pieces[this.nb_piece].y
		this.rotation = list_pieces[this.nb_piece].rotation
		this.color = list_pieces[this.nb_piece].color
		this.width =  tetriminios[this.index_piece].rotation[this.rotation][0].length
		this.height = tetriminios[this.index_piece].rotation[this.rotation].length
		this.data = tetriminios[this.index_piece].rotation[this.rotation]
		this.nb_piece = this.nb_piece + 1
		// call check GameOver
		this.GameOver = this.checkGameOver(field)
		this.penalty_lines = 0
	}
	// Getters
	getNb_piece(){
		return this.nb_piece
	}
	getScore(){
		return this.score
	}
	getGameOver(){
		return this.GameOver 
	}
	getPenaltyLines(){
		return this.penalty_lines
	}
	// Movements
	// rotate
	rotate(field){
		const oldRotation = this.rotation;
		const oldData = this.data;
		const oldWidth = this.width;
		const oldHeight = this.height;
		const oldX = this.x;

		this.rotation = (this.rotation + 1) % 4;
		this.data = tetriminios[this.index_piece].rotation[this.rotation]
		this.width = this.data[0].length
		this.height = this.data.length

		if (this.checkCollision(field)){
			// Try wall kick: push left
			this.x -= 1;
			if (this.checkCollision(field)){
				// Try push left more
				this.x -= 1;
				if (this.checkCollision(field)){
					// Try push right instead
					this.x = oldX + 1;
					if (this.checkCollision(field)){
						// All wall kicks failed, revert everything
						this.x = oldX;
						this.rotation = oldRotation;
						this.data = oldData;
						this.width = oldWidth;
						this.height = oldHeight;
					}
				}
			}
		}
	}
	// right
	right(field){
		this.x += 1;
		if (this.checkCollision(field)){
			this.x -= 1;
		}
	}
	// left
	left(field){
		this.x -= 1;
		if (this.checkCollision(field)){
			this.x += 1;
		}
	}
	// gravity
	down(gravity, list_pieces, field, freeze_lines){
		this.penalty_lines = 0
		this.y += gravity;
		if (this.checkCollision(field)){
			//Undo Move
			this.y -= gravity;
			// Merge piece with field
			this.addPieceToField(field, list_pieces)
			// check full lines
			const lines_cleared = this.clearlines(field, freeze_lines)
			this.score = this.score + lines_cleared
			this.penalty_lines = lines_cleared  
		}
	}
	// softdrop
	softDrop(field){
		this.y += 1;
		if (this.checkCollision(field)){
			//Undo Move
			this.y -= 1;
			// check full lines
			this.clearlines(field)
		}
	}
	// harddrop
	hardDrop(field){
		while(1){
			this.y += 1;
			if (this.checkCollision(field)){
				//Undo Move
				this.y -= 1;
				break
			}  
		}
		// check full lines
		this.clearlines(field)
	}  
}

module.exports = ClassTipo;