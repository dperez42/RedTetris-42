<template>
<div class="container">
  
  <div v-if="debug && game===null">
    here{{game}}here
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="roomName">Room Name</label>
        <input  
          id="roomName"
          v-model="roomName"
          type="text"
          placeholder="Enter room name"
          required
        />
      </div>
      <div class="form-group">
        <label for="player">Player Name</label>
        <input  class="input"
          id="playerName"
          v-model="playerName"
          type="text"
          placeholder="Your name"
          required
        />
      </div>
      <button class="button" type="submit"> join </button>
    </form>
    {{socket_id}}
  </div>
  
  <div v-if="error.data==='NOT PARAMETERS'">
    <Info :title="'Sorry, To enter in a Game!'" :title1="'type:'" :title2="'http://server_name_or_ip:3000/room/player_name'"/>
  </div>
  <div v-else-if="error.data==='WRONG USER'">
    <Info :title="'Sorry, this Username is already in the Game!'" :title1="'This Username is already in the game.'" :title2="'Choose another Username.'"/>
  </div>
  <div v-else-if="error.data==='GAME STARTED'">
    <Info :title="'Sorry, the Game Has Started!'" :title1="'This RedTetris match is already in progress.'" :title2="'Join to another game or created your own game.'"/>
  </div>
  <div v-else-if="error.data==='GAME FINISHED'">
    <Info :title="'Sorry, the Game Has Finished!'" :title1="'This RedTetris match is finish.'" :title2="'Join to another game or created your own game.'"/>
  </div>
  
  <div v-else-if="game != null" class="game-layout">
    
    <aside class="left-panel">
      <h2>Galería de Tableros</h2>
      <div class="gallery">
        <div v-for="(game, index) in game.players" :key="index" >
          <div v-if=" game.players[index].socket !== socket_id">
            <p>Player: {{ game.players[index].name}}</p>
            <Spectrum  :room_name="game.name" :game="game.players[index]" />
          </div>
        </div>
      </div>
    </aside>
    
    <main class="right-panel">
      <div class="board-wrapper">
        <div v-for="(game, index) in this.game.players" :key="index">
          
          <div v-if=" game.players[index].socket == socket_id" >
          <Game  :room_name="game.name" :game="game.players[index]" :type="game.isOnePlayer"/>
           
          </div>
        </div>
        <!-- 🔥 Línea de botones de modo -->
        <!-- Botones centrados debajo del juego -->
        <div class="buttons-wrapper">
          <div
            v-if="this.game.players[0].socket == socket_id && !game.isCountdown && !game.isStart"
            class="mode-buttons"
          >
            <button
              v-for="m in modes"
              :key="m.value"
              :class="{ active: mode === m.value }"
              @click="clickMode(m.value)"
            >
            {{ m.label }}
            </button>
            <button
              v-for="m in especial_modes"
              :key="m.value"
              :class="{ active: ghost_mode === true }"
              @click="clickEspecialMode()"
            >
            {{ m.label }}
            </button>
          </div>
          <button v-if="game.players[0].socket == socket_id & !game.isCountdown & !game.isStart" 
          class="start-button" @click="clickStart()" @keydown.space.prevent>Start</button>
          <button v-if="!game.isCountdown & !game.isStart" 
          class="start-button" @click="clickRanking()" @keydown.space.prevent>Ranking</button>
          <button v-if="game.players[0].socket == socket_id & !game.isCountdown & game.isStart" 
          class="start-button" @click="clickPause()" @keydown.space.prevent>{{game.isPause ? "Continue":"Pause"}}</button>
          <button v-if="game.players[0].socket == socket_id & !game.isCountdown & game.isStart" 
          class="start-button" @click="clickReStart()" @keydown.space.prevent>ReStart</button>
        </div>
      </div>
    </main>

    <!-- pop up countdown -->
    <div v-if="game != null & game.isCountdown" class="overlay_countdown">
      <div class="popup_countdown">    
        <h1>{{ game.name }}</h1>
        <h3 class="popup_count"> Start in {{ game.countdown }} seconds...</h3>
      </div>
    </div>
    <!-- pop up finish -->
    <div v-if="game != null & game.isFinish" class="overlay_countdown">
      <div class="popup_countdown">    
        <h1>{{ game.name }}</h1>
        <h3 class="popup_count">{{game.winner_socket === socket_id ? 'YOU WIN':'The game is finish'}}</h3>
      </div>
    </div>
    <!-- pop up ranking -->
    <div v-if="game != null & ranking" class="overlay_countdown">
      <div class="popup_ranking">
        <h1 class="ranking-title">🏆 HALL OF FAME 🏆</h1>
        <div class="ranking-table crt-overlay">
          <div v-for="(user, x) in game.ranking"  :key="x" >
            <div class="ranking-name">{{ x + 1 }}. {{ user.name }}</div>
            <div class="ranking-score">{{ user.score }}</div> 
          </div>
        </div>
        <button
      v-if="!game.isCountdown && !game.isStart"
      class="retro-button"
      @click="clickRanking()"
      @keydown.space.prevent
    >
      CLOSE
    </button>
      </div>
    </div>

  </div>
</div>
</template>


<style scoped>
.container {
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Segoe UI", sans-serif;
  background: #111;
  color: white;
}

.game-layout {
  display: flex;
  width: 100%;
  height: 100%;
}
/* Sección izquierda */
.left-panel {
  width: 50%;
  background-color: #c38b8b;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #ccc;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.mini-board {
  width: 100px;
  height: 100px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #aaa;
  border-radius: 4px;
}

/* Sección derecha */
.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(173, 37, 37);
  min-height: 100vh;        /* full viewport height */
}

.board-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;  /* stack board + buttons */
  justify-content: center;  /* center vertically inside wrapper */
  align-items: center;      /* center horizontally */
  gap: 1rem;
  text-align: center;
}

.tetris-board {
  width: 300px;
  height: 500px;
  background-color: #000;
  margin-bottom: 1rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #333;
  box-sizing: border-box;
}
.buttons-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.start-button {
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  background-color: #28a745;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
}

.start-button:hover {
  background-color: #218838;
}

/* Buttons*/
.buttons-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.start-button {
  background: #00bcd4;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  margin: 0.4rem;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.start-button:hover {
  background: #00e5ff;
  color: black;
}

.mode-buttons {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 1rem 0;
}

.mode-buttons button {
  background: #222;
  color: #fff;
  border: 2px solid #555;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.85rem;
  font-family: system-ui, "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
}

.mode-buttons button:hover {
  background: #444;
}

.mode-buttons button.active {
  background: #00e5ff;
  color: #000;
  border-color: #00e5ff;
  box-shadow: 0 0 8px #00e5ff;
}

/* pop up count down*/
.overlay_countdown {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75); /* optional dim background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* ensures it appears on top */
  animation: fadeIn 0.4s ease;
}
.popup_countdown {
  width: 300px;
  height: 200px;
  /*background: radial-gradient(circle at top left, #ffffff, #b30000);*/
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  border: 2px solid #0ff;
  border-radius: 8px;
  padding: 20px;
  z-index: 9999;
  animation: pulseGlow 2s infinite alternate ease-in-out;
}
/* Título con sombra */
.popup_countdown h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.3);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 125px rgba(0, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 125px rgba(0, 255, 255, 0.9);
  }
}

/* Countdown con efecto de rebote */
.popup_count {
  font-size: 1.2rem;
  animation: bounce 1s infinite;
  font-weight: bold;
}

/* Efecto de rebote */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    transform: scale(1);
  }
  50% {
    transform: translateY(-10px);
    transform: scale(1.5);
  }
}



.popup_ranking {
  width: 320px;
  height: 300px;
  /*background: radial-gradient(circle at top left, #ffffff, #b30000);*/
  background: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  border: 2px solid #0ff;
  border-radius: 8px;
  padding: 20px;
  z-index: 9999;
  animation: pulseGlow 2s infinite alternate ease-in-out;
}
/* RANKING */
/* Título brillante */
.ranking-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #ff004d;
  text-shadow: 0 0 10px #ff004d, 0 0 20px #ff004d;
  animation: neonPulse 1.8s infinite alternate;
}

/* Tabla de ranking */
.ranking-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  max-height: 300px;      /* altura máxima antes de aparecer scroll */
  overflow-y: auto;       /* barra de desplazamiento vertical */
  
  padding-right: 5px;     
  scrollbar-width: thin;  
  scrollbar-color: #0ff #111; 
  
}
/* CRT scanlines + overlay */
.crt-overlay {
  position: relative;
  overflow: hidden;
}

/* Líneas horizontales tipo CRT */
.crt-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.03) 2px,
    transparent 2px,
    transparent 4px
  );
  animation: flicker 0.2s infinite;
  pointer-events: none;
  z-index: 2;
}

/* Brillo dinámico que se mueve verticalmente */
.crt-overlay::after {
  content: "";
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: scan 4s linear infinite;
  pointer-events: none;
  z-index: 3;
}

.ranking-row {
  display: flex;
  justify-content: space-between;
  background: #111;
  border: 2px solid #0ff;
  padding: 8px;
  border-radius: 4px;
  transition: 0.2s;
}

.ranking-row.top1 {
  background: #ffcc00;
  color: #000;
  border-color: #fff700;
  text-shadow: 0 0 6px #fff;
}

.ranking-row.top3 {
  border-color: #ff004d;
}

.ranking-name {
  text-align: left;
  flex: 1;
}

.ranking-score {
  text-align: right;
  flex: 0 0 50px;
}

/* Botón retro */
.retro-button {
  background: #0ff;
  color: #000;
  font-family: "Press Start 2P", monospace;
  padding: 8px 20px;
  border: 3px solid #fff;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 0 10px #0ff;
  transition: all 0.2s ease-in-out;
}

.retro-button:hover {
  background: #ff004d;
  color: #fff;
  box-shadow: 0 0 20px #ff004d;
}
@keyframes neonPulse {
  from {
    text-shadow: 0 0 5px #ff004d, 0 0 10px #ff004d;
  }
  to {
    text-shadow: 0 0 20px #ff004d, 0 0 40px #ff004d;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { socket } from '../services/sockets'
import Game from "./subcomponents/game.vue"
import Spectrum from "./subcomponents/spectrum.vue"
import Info from "./subcomponents/info.vue"

//store
const store = useStore()

//Data (con ref)
const roomName = ref('test_room')
const playerName = ref('test_player')
const visible = ref(true)
const count = ref(10)
const modes = ref([
  { label: "🟢 Easy", value: "easy" },
  { label: "🟠 Medium", value: "medium" },
  { label: "🔴 Hard", value: "hard" },
])
const especial_modes = ref([
  { label: "👻 Ghost", value: "ghost" },
])
const mode = ref('medium')
const ghost_mode = ref(false)
const ranking = ref(false)
const debug = ref(import.meta.env.VITE_DEBUG);
// Computed
const game = computed(() => store.getters['games_store/getGame'] || null)
const socket_id = computed(() => store.getters['games_store/getSocket'] || null)
const error = computed(() => store.getters['error_store/getError'] || null)

//Methods
const clickStart = () => {
  console.log("click Start")
      const msg = {
        command: 'start',
        gameName: this.game.name,
        mode : this.mode === 'medium' ? 500: this.mode === 'hard' ? 250:1000,
        ghost_mode: this.ghost_mode
      }
      console.log("send", msg)
      socket.emit('red_tetris_server',msg)
}

const clickPause = () => {
  console.log("click Pause")
  const msg = {
    command: 'pause',
    getName: game.value.name
  }
  console.log("send", msg)
  socket.emit('red_tetris_server', msg)
}

const clickReStart = () => {
  console.log("click ReStart")
  const msg = {
    command: 'restart',
    getName: game.value.name,
    mode: mode.value === 'medium' ? 500 : mode.value === 'hard' ? 250 : 1000,
    ghost_mode: ghost_mode.value
  }
  console.log("send", msg)
  socket.emit('red_tetris_server', msg)
}

const clickMode = (selectedMode) => {
  mode.value = selectedMode
}

const clickEspecialMode = () => {
  ghost_mode.value = !ghost_mode.value
}

const clickRanking = () => {
  ranking.value = !ranking.value
}

const keyHandler = (event) => {
  if (!game.value?.isPause) {
    if(['ArroDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' ', 'Escape'].indexOf(event.key) > -1) {
      const msg = {
        command: 'move',
        gameName: game.value.name,
        playSocket: socket_id.value,
        move: event.key
      }
      if (game.value?.isStart) {
        socket.emit('red_tetris_server', msg)
      }
    }
  }
}
const handleSubmit = () => {
  const msg = {
    command: 'join',
    roomName: roomName.value,
    playerName: playerName.value
  }
  console.log("send joinnig", msg)
  socket.emit('red_tetris_server', msg)
}

//Watchers
watch(game, (newGame) => {
  console.log("Game change:", newGame)
})

watch(socket_id, (newSocket) => {
  console.log("Socket change:", newSocket)
})

watch(error, (newError) => {
  console.log("Error change:", newError)
})

//Lyfecycle
onMounted(() => {
  if (debug.value){
    console.log("cargo fake users to develop")

  }
  document.body.addEventListener('keydown', keyHandler)
})

//
onBeforeUnmount(() => {
  document.body.removeEventListener('keydown', keyHandler)
})

</script>
