// Class for player data: name, cocket, board, score, freeze_lines, the number of piece playing and the piece playing

const Piece = require("./Piece.js");

class ClassTipo {
    constructor(sizeColumn, sizeRow, name, socket) { 
		this.sizeColumn = sizeColumn
		this.sizeRow = sizeRow
		this.name = name
		this.socket = socket
		this.piece = null
		this.nb_piece = 1
		// campo con piezas fijas
		this.field = Array.from({ length: sizeRow }, () => Array(sizeColumn).fill(0));
		// campo con piezas fijas + movil
		this.field_piece = Array.from({ length: sizeRow }, () => Array(sizeColumn).fill(0));
		this.score = 0
		this.freeze_lines = 0
		this.gameOver = false
	}
	// Init Player data
	init(){
		// roder number of piece to play
		this.nb_piece = 1
		// campo con piezas fijas
		this.field = Array.from({ length: this.sizeRow }, () => Array(this.sizeColumn).fill(0));
		// campo con piezas fijas + movil
		this.field_piece = Array.from({ length: this.sizeRow }, () => Array(this.sizeColumn).fill(0));
		this.score = 0
		this.freeze_lines = 0
		this.gameOver = false
	}
	// add first piece oject
	addFirstPiece(list_pieces){
		const newPiece = new Piece();
		newPiece.firstPiece(list_pieces)
		this.piece = newPiece;
	}
	// Move Piece
	movePiece(move, step, list_pieces, ghost_mode){
		if (!this.gameOver){
			this.penalty_lines = 0
			if (move==='ArrowLeft') {this.piece.left(this.field)}
			if (move==='ArrowRight') {this.piece.right(this.field)}
			if (move==='ArrowUp') {this.piece.rotate(this.field)}
			if (move==='ArrowDown') {this.piece.softDrop(this.field)}
			if (move===' ') {this.piece.hardDrop(this.field)}
			if (move==='down') {this.piece.down(step,list_pieces, this.field, this.freeze_lines)}
			this.nb_piece = this.piece.getNb_piece()
			this.score = this.piece.getScore()
			this.penalty_lines = this.piece.getPenaltyLines()
			this.gameOver = this.piece.getGameOver()
			if (this.gameOver){
				console.log("GAME OVER")
			}
			this.merge(ghost_mode)
		}
		return
	}
	// Merge the borad with the piece
	merge(ghost_mode){
		let field_temp = Array.from({ length: this.sizeRow }, () => Array(this.sizeColumn).fill(0));
		for (let i = 0; i < this.sizeRow; i++){
         for (let j = 0; j < this.sizeColumn; j++){
                field_temp[i][j]=this.field[i][j];
		 }
		}
		if (!ghost_mode || this.piece.y<2 ){ 
			for (let i = this.piece.y; i < this.piece.y + this.piece.height; i++){
			for (let j = this.piece.x; j < (this.piece.x +  this.piece.width); j++){
				//// solo pinta lo que esta dentro de los limites
				if ((i >=0 & i <20) & (j>=0 & j <10)){
					//field_temp[i][j]=0;
					if (this.piece.data[i-this.piece.y][j-this.piece.x]===1){
						field_temp[i][j]=this.piece.color;
					}
				}
			}
			}
		}
		this.field_piece = field_temp
	}
	/// getters
	getNbpiece(){
		return this.nb_piece
	}
	getStatusPlayer(){
		return this.gameOver
	}
	getPenaltyLines(){
		return this.penalty_lines
	}
	addFreezeLines(lines){
		this.freeze_lines=this.freeze_lines+lines
	}
}

module.exports = ClassTipo;