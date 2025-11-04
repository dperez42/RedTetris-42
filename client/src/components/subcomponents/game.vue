<template>
  <div class="tetris">
  <!-- Room Name -->
  <div class="status">
      <span class="roomname">{{room_name}} nb:{{this.game.gameOver}}</span>
  </div>
  <!-- Board -->
  <div class="board">
		<div v-for="(row, y) in this.transpose_matrix(this.game.field_piece)"  :key="y">
      <div v-for="(cell, x) in row"  :key="x" >
        <div class="cell" :style="{
          backgroundColor: getcolour(cell) || '#222',  
          border: 19 - x < this.game.freeze_lines ? '3px solid #f00' : '1px solid #111'
          }"
        
        >
          {{cell}}
        </div>
      </div>
		</div>
  </div>
  <!--- Score and username-->
    <div class="status">
      <span class="username">{{this.game.name}}</span>
      <span class="score"> Score: {{this.game.score}}</span>
    </div>
  
  <!-- pop up game over -->
    <div v-if="this.game.gameOver" class="overlay_gameover">
      <div class="popup_gameover">    
        <h2>🧱 Game Over!</h2>
        <p>Your score: {{ this.game.score }}</p>
        <button v-if="this.type" class="start-button" @click="clickReStart()" @keydown.space.prevent>Start</button>
      </div>
    </div>
  </div>
  
</template>

<script>
import { socket } from '../../services/sockets'

export default {
  name: 'Game',
  components: {
  },
  props: {
    room_name: {
      type: String,
      default: "Room Name"
    },
    game: {
      type: Object,
      default: { "username": 'Player 1', "score":0, "board":[]}
    },
    type: {
      type: Boolean,
      default: true
    },
  },
  data() {
	return {
    width: 10,
    height: 20,
		isBorder: true,
  	}
  },
  methods: {
    getcolour(nb_col){
      const colors = ['#ffffff','#ff595e','#ffca3a', '#1982c4', '#8ac926','#6a4c93']
      return(colors[nb_col])
    },
    transpose_matrix(matrix){
      return matrix[0].map((_, x) => matrix.map(row => row[x]))
    },
    clickReStart(){
      console.log("click ReStart")
      const msg = {
        command: 'restart',
        gameName: this.room_name
      }
      console.log("send", msg)
      socket.emit('red_tetris_server',msg)
    },

  },
  mounted() {
  },
  beforeUnmount() {
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tetris{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #111;
}
.board {
  margin-top: 10px;
  display: grid;
  grid-template-rows: repeat(20, 20px);
  grid-template-columns: repeat(10, 20px);
  gap: 1px;
  background:#111;
}

.cell {
  width: 20px;
  height: 20px;
  text-align: center;
  border: 1px solid rgb(106, 106, 106);
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.5);
}
.status{
  margin-top: 15px;
  font-family: monospace;
  font-size: medium;
  display: flex;
  justify-content: space-between;
  width: 200px;
  color: #a22f2f;
}
.roomname{
  color: rgb(232, 242, 242);
  font-family: monospace;
  font-size: larger;
}
.username{
  color: aqua;
}
.overlay_gameover{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* ensures it appears on top */
  animation: fadeIn 0.4s ease;
}
.popup_gameover {
  width: 300px;
  height: 200px;
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  border-radius: 8px;
  border: 2px solid #0ff;
  padding: 20px;
  z-index: 9999;
  animation: popIn 0.3s ease;
  animation: pulseGlow 2s infinite alternate ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 125px rgba(0, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 125px rgba(0, 255, 255, 0.9);
  }
}
</style>