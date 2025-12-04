<template>
  <div class="tetris">

    <!-- Info del jugador -->
    <div class="tetris-info">
      <div class="roomname">{{ room_name }}</div>
      <div class="username">Player: {{ game.name }}</div>
      <div class="score">Score: {{ game.score }}</div>
    </div>

    <!-- Board -->
    <div class="board">
      <div class="row" v-for="(row, y) in transpose_matrix(game.field_piece)" :key="y">
        <div v-for="(cell, x) in row" :key="x">
          <div
            class="cell"
            :style="{
              '--cell-color': getcolour(cell) || '#222',
              border:
                19 - x < game.freeze_lines
                  ? '3px solid #f00'
                  : getcolour(cell) === '#ffffff'
                  ? '3px solid #000'
                  : '3px solid ' + darkenColor(getcolour(cell), 0.6),
              animation:
                getcolour(cell) === '#ffffff'
                  ? 'none'
                  : 'pulseCell 1.5s infinite alternate ease-in-out'
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Popup Game Over -->
    <div v-if="game.gameOver" class="overlay_gameover">
      <div class="popup_gameover">
        <h2>🧱 Game Over!</h2>
        <p>Your score: {{ game.score }}</p>
        <button
          class="start-button"
          @click="clickReStart"
          @keydown.space.prevent
        >
          Restart Game
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { socket } from '../../services/sockets'

// Props
const { room_name, game, type } = defineProps({
  room_name: { type: String, default: "Room Name" },
  game: {
    type: Object,
    default: () => ({ username: 'Player 1', score: 0, field_piece: [] })
  },
  type: { type: Boolean, default: true }
})

// Reactive state
const width = ref(10)
const height = ref(20)
const isBorder = ref(true)

// Métodos
const getcolour = (nb_col) => {
  const colors = ['#ffffff','#ff595e','#ffca3a','#1982c4','#8ac926','#6a4c93']
  return colors[nb_col] || '#ffffff'
}

const darkenColor = (hex, amount = 0.2) => {
  if (!hex.startsWith('#') || hex.length !== 7) return hex
  const rgb = hex.substring(1).match(/.{2}/g).map(v => parseInt(v,16))
  const darker = rgb.map(v => Math.floor(v * (1 - amount)))
  return '#' + darker.map(v => v.toString(16).padStart(2,'0')).join('')
}

const transpose_matrix = (matrix) => {
  if (!matrix || matrix.length === 0) return []
  return matrix[0].map((_, x) => matrix.map(row => row[x]))
}

const clickReStart = () => {
  const msg = {
    command: 'restart',
    gameName: room_name
  }
  if (import.meta.env.VITE_DEBUG==='true'){console.log("GAME: click Restart.")};
  if (import.meta.env.VITE_DEBUG==='true'){console.log("GAME: send msg.", msg)}
  socket.emit('red_tetris_server', msg)
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
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
}
/* Info dentro del tablero */
.tetris-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: 'Courier New', monospace;
  color: #0ff;
  text-shadow: 2px 2px 5px #f00;
}
.roomname { font-size: 1.2em; color: #0ff; text-shadow: 2px 2px 6px #ff0; }
.username { color: #ff0; }
.score { color: #f0f; }

.board {
  display: flex;
  flex-direction: row;
  /* NORMAL*/
  background: #111;
  border: 2px solid #333;
  overflow: hidden;
  /* HYPERRETRO
  background: linear-gradient(45deg, #0ff 10%, #f00 90%);
  border: 3px solid #0ff;
  padding: 10px;
  box-shadow:
    0 0 30px #0ff,
    0 0 60px #f00 inset;
  */
}
/* 🔸 Cada fila */
.row {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.cell {
  width: 20px;
  height: 20px;
  text-align: center;
  /*border: 1px solid #111;*/
  border-radius: 3px;
  /* Neón */
  box-shadow:
    0 0 5px var(--cell-color),
    0 0 10px var(--cell-color),
    0 0 20px var(--cell-color);
  animation:  pulseCell 1.5s infinite alternate ease-in-out; /* pulseCell, pulseNeon*/
  background-color: var(--cell-color);
}
/* Pulso independiente de cada celda */
@keyframes pulseCell {
  0% { box-shadow: 0 0 3px var(--cell-color), 0 0 6px var(--cell-color), inset 0 0 2px rgba(255,255,255,0.2); transform: scale(0.95);}
  50% { box-shadow: 0 0 8px var(--cell-color), 0 0 16px var(--cell-color), inset 0 0 3px rgba(255,255,255,0.3); transform: scale(1.05);}
  100% { box-shadow: 0 0 5px var(--cell-color), 0 0 10px var(--cell-color), inset 0 0 2px rgba(255,255,255,0.2); transform: scale(1);}
}
/* Animación suave de neón */
@keyframes pulseNeon {
  0% {
    box-shadow:
      0 0 3px var(--cell-color),
      0 0 6px var(--cell-color),
      0 0 12px var(--cell-color),
      inset 0 0 2px rgba(255,255,255,0.2);
    transform: scale(0.95);
  }
  50% {
    box-shadow:
      0 0 8px var(--cell-color),
      0 0 16px var(--cell-color),
      0 0 32px var(--cell-color),
      inset 0 0 3px rgba(255,255,255,0.3);
    transform: scale(1.05);
  }
  100% {
    box-shadow:
      0 0 5px var(--cell-color),
      0 0 10px var(--cell-color),
      0 0 20px var(--cell-color),
      inset 0 0 2px rgba(255,255,255,0.2);
    transform: scale(1);
  }
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
.start-button {
  margin-top: 20px;
  padding: 12px 30px;
  font-size: 1.1em;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #000;
  background: linear-gradient(135deg, #0ff, #0af);
  border: 2px solid #0ff;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}
.start-button:hover {
  background: linear-gradient(135deg, #0af, #0ff);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.9);
  transform: scale(1.05);
}
.start-button:active {
  transform: scale(0.95);
}
</style>