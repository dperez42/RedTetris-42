<template>
  <div class="tetris">
    <!-- Board -->
    <div class="board">
      <div class="row" v-for="(row, y) in transpose_matrix(game.field)" :key="y">
        <div v-for="(cell, x) in row" :key="x">          
          <div class="cell" :style="{ backgroundColor: isEmpty(x)}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

// store
const store = useStore()

// Props
const props = defineProps({
  room_name: {
    type: String,
    default: "Room Name"
  },
  game: {
    type: Object,
    default: () => ({ username: 'Player 1', score: 0, field: [] })
  }
})

// Reactive state
const width = ref(10)
const height = ref(20)
const isBorder = ref(true)

// Utils
const getcolour = (nb_col) => {
  const colors = ['#0000ff','#1982c4','#6a4c93', '#ffca3a', '#8ac926','#ff924c']
  return colors[nb_col]
}
const isEmpty = (row) => {
      let empty = '#ffffff'
      props.game.field[row].forEach(cell => {
        if (cell > 0) {
          empty = '#8ac926'
        }
      })
      return empty
}
const transpose_matrix = (matrix) => {
  if (!matrix || matrix.length === 0) return []
  return matrix[0].map((_, x) => matrix.map(row => row[x]))
}

// Color logic
const getCellColor = (cell) => {
  if (cell > 0) return getcolour(cell)
  return '#ffffff'
}

// computed
const socket_id = computed(() => store.state.games_store.socket)

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tetris{
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(47, 42, 131);
  padding: 10px;
}
.board {
   display: flex;
  flex-direction: row;
  background: #111;
  border: 2px solid #333;
  overflow: hidden;
}
/* 🔸 Cada fila */
.row {
  display: flex;
  flex-direction: column;
  flex: 1;
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