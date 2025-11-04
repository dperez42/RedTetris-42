<template>
  <div class="tetris">
  <!-- Room Name -->
  <div class="status">
      <span class="roomname">{{room_name}}</span>
  </div>
  <!-- Board -->
  <div class="board">
		<div v-for="(row, y) in this.transpose_matrix(this.game.field)"  :key="y">
      <div v-for="(cell, x) in row"  :key="x" >
        <div class="cell" :style="{backgroundColor: isEmpty(x)}">
        </div>
      </div>
    </div>
  </div>
  <!--- Score and username-->
    <div class="status">
      <span class="username">{{this.game.name}}</span>
      <span class="score"> Score: {{this.game.score}}</span>
      {{socket_id}}
    </div>
  </div>
  
</template>



<script>
import store from '../../store/index'

export default {
  name: 'Spectrum',
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
    }
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
      const colors = ['#0000ff','#1982c4','#6a4c93', '#ffca3a', '#8ac926','#ff924c']
      return(colors[nb_col])
      return('#1982c4')
    },
    transpose_matrix(matrix){
      return matrix[0].map((_, x) => matrix.map(row => row[x]))
    },
    isEmpty(row){
      let empty = '#ffffff'
      this.game.field[row].forEach(cell => {
        if (cell > 0) {
          empty = '#8ac926'
        }
      })
      return empty
    }

  },
  computed:{
    socket_id(){
      return store.state.games_store.socket
    }
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
  background-color: rgb(47, 42, 131);
}
.board {
  margin-top: 10px;
  display: grid;
  grid-template-rows: repeat(20, 10px);
  grid-template-columns: repeat(10, 10px);
  gap: 1px;
  background:#111;
}

.cell {
  width: 10px;
  height: 10px;
  border: 1px solid #a22f2f;
  text-align: center;
  border: 1px solid #111
}
.cell.filled{
  background: #19758b;
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
</style>