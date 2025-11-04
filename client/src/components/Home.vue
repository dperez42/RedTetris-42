<template>
<div class="container">
  <div v-if="this.game != null" class="game-layout">
    <!-- Sección izquierda: Galería -->
    <div class="left-panel">
      <h2>Galería de Tableros</h2>
      <div class="gallery">
        <div v-for="(game, index) in this.game.players" :key="index" >
          <div v-if=" this.game.players[index].socket !== socket_id">
            <p>Tablero {{ index}}</p>
            <Spectrum  :room_name="this.game.name" :game="this.game.players[index]" />
            <!-- Aquí podrías insertar un componente Tetris en miniatura -->
          </div>
        </div>
      </div>
    </div>
    <!-- Sección derecha: Tablero principal -->
    <div class="right-panel">
      <div class="board-wrapper">
        <div v-for="(game, index) in this.game.players" :key="index">
          
          <div v-if=" this.game.players[index].socket == socket_id" class="tetris-board">
          <Game  :room_name="this.game.name" :game="this.game.players[index]" :type="this.game.isOnePlayer"/>
            <!-- Aquí iría el componente Tetris grande -->
          </div>
        </div>
        <button v-if="this.game.players[0].socket == socket_id & !this.game.isCountdown & !this.game.isStart" 
        class="start-button" @click="clickStart()" @keydown.space.prevent>Start</button>
        <button v-if="this.game.players[0].socket == socket_id & !this.game.isCountdown & this.game.isStart" 
        class="start-button" @click="clickPause()" @keydown.space.prevent>{{this.game.isPause ? "Continue":"Pause"}}</button>
        <button v-if="this.game.players[0].socket == socket_id & !this.game.isCountdown & this.game.isStart" 
        class="start-button" @click="clickReStart()" @keydown.space.prevent>ReStart</button>
      </div>
    </div>

    <!-- pop up countdown -->
    <div v-if="this.game != null & this.game.isCountdown" class="overlay_countdown">
      <div class="popup_countdown">    
        <h1>{{ this.game.name }}</h1>
        <h3 class="popup_count"> Start in {{ this.game.countdown }} seconds...</h3>
      </div>
    </div>
    <!-- pop up finish -->
    <div v-if="this.game != null & this.game.isFinish" class="overlay_countdown">
      <div class="popup_countdown">    
        <h1>{{ this.game.name }}</h1>
        <h3 class="popup_count">{{this.game.winner_socket === socket_id ? 'YOU WIN':'The game is finsh'}}</h3>
      </div>
    </div>

  </div>
  <div v-if="this.game == null">
    <div class="card">
      <button type="button" @click="click">send text message </button>
  
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>
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

</div>

</template>

<script>
import { ref } from 'vue'
import { socket } from '../services/sockets'
import Game from "./subcomponents/game.vue"
import Spectrum from "./subcomponents/spectrum.vue"
import store from '../store/index' 

export default {
  name: 'Home',
  components: {
    Game,
    Spectrum
  },
  props: {
    },
  data() {
    return {
      roomName:'test_room',
      playerName:"test_player",
      visible: true,
      count: 10
    }
  },
  methods: {
    createBoard(){
      const arr = new Array(this.width).fill(null)
      this.game.board = arr.map(()=> new Array(this.height).fill(Math.floor(Math.random()*6)))
      console.log(this.board)
      //this.board = Array.from({length: this.height}, () => Array(this.width).fill(colors[Math.floor(Math.random()*colors.length)]))
      //this.board = Array.from({length: this.height}, () => Array(this.width).fill(0))
    },
    handleSubmit(){
      console.log("Joinin")
       const msg = {
        command: 'join',
        playerName: this.playerName,
        roomName: this.roomName,
        socherId: socket.id,
        data: ''
      }
      socket.emit('red_tetris_server',msg)
    },
    click(){
      console.log("click")
      const msg = {
        command: 'join',
        playerName: this.playerName,
        roomName: this.roomName
      }
      socket.emit('red_tetris_server',msg)
    },
    clickStart(){
      console.log("click Start")
      const msg = {
        command: 'start',
        gameName: this.game.name
      }
      console.log("send", msg)
      socket.emit('red_tetris_server',msg)
    },
    clickPause(){
      console.log("click Pause")
      const msg = {
        command: 'pause',
        gameName: this.game.name
      }
      console.log("send", msg)
      socket.emit('red_tetris_server',msg)
    },
    clickReStart(){
      console.log("click ReStart")
      const msg = {
        command: 'restart',
        gameName: this.game.name
      }
      console.log("send", msg)
      socket.emit('red_tetris_server',msg)
    },
    keyHandler(event){
      if (!this.game.isPause){
        if (['ArrowDown',  'ArrowUp',  'ArrowRight',  'ArrowLeft', ' ','Escape'].indexOf(event.key) > -1) {
          const msg = {
            command: 'move',
            gameName: this.game.name,
            playerSocket: this.socket_id,
            move: event.key
          }
          if (this.game.isStart){
            socket.emit('red_tetris_server', msg);
          }
        }
      }
    }
  },
  mounted() {
    /*
    this.createBoard()
    this.game.username = 'daniel'
    this.game.score = 10
    console.log(this.game)
    */
    //document.body.addEventListener('keydown', this.keyHandler);
    //window.addEventListener('keydown', this.callback_keydown, { capture: true });
    //window.addEventListener('keyup', this.callback_keyup, { capture: true });
  },
  computed:{
    example_board() {
      return store.state.games_store.example_board
    },
    game(){
      return store.state.games_store.game
    },
    socket_id(){
      return store.state.games_store.socket
    }
  },
  beforeMount() {
    document.body.addEventListener('keydown', this.keyHandler);
    //window.addEventListener('keydown', this.callback_keydown, { capture: true });
    //window.addEventListener('keyup', this.callback_keyup, { capture: true });
  },
  beforeUnmount() {
    document.body.removeEventListener('keydown', this.keyHandler);
    //window.removeEventListener('keydown', callback_keydown,  { capture: true });
    //window.removeEventListener('keyup', this.callback_keyup, { capture: true });
  },
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.game-layout {
  display: flex;
  height: 100vh;
}
/* Sección izquierda */
.left-panel {
  width: 60%;
  background-color: #f4f4f4;
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
}

.board-wrapper {
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

</style>
