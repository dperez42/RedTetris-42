<template>
  <div class="tetris-container">
    <div ref="background"></div>

    <div class="message-box">
      <h1>🧱 Sorry, the Game Has Started!</h1>
      <p>This RedTetris match is already in progress.<br>
        Join to another game or created your own game.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const background = ref(null)

onMounted(() => {
  const colors = ["red", "yellow", "blue", "green", "purple"]
  const bg = background.value

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("div")
    piece.classList.add("tetris-piece", colors[Math.floor(Math.random() * colors.length)])
    piece.style.left = Math.random() * 100 + "vw"
    piece.style.top = Math.random() * -100 + "vh"
    const size = 20 + Math.random() * 15
    piece.style.width = size + "px"
    piece.style.height = size + "px"
    piece.style.animationDuration = 4 + Math.random() * 8 + "s"
    piece.style.animationDelay = Math.random() * 5 + "s"
    bg.appendChild(piece)
  }
})
</script>

<style scoped>
.tetris-container {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #0b0b0b 0%, #000 100%);
  overflow: hidden;
  font-family: 'Press Start 2P', monospace;
  color: #fff;
  position: relative;
}

.tetris-piece {
  position: absolute;
  opacity: 0.8;
  border-radius: 3px;
  animation: fall linear infinite;
}

.tetris-piece.red    { background: #ff595e; box-shadow: 0 0 10px #ff595e; }
.tetris-piece.yellow { background: #ffca3a; box-shadow: 0 0 10px #ffca3a; }
.tetris-piece.blue   { background: #1982c4; box-shadow: 0 0 10px #1982c4; }
.tetris-piece.green  { background: #8ac926; box-shadow: 0 0 10px #8ac926; }
.tetris-piece.purple { background: #6a4c93; box-shadow: 0 0 10px #6a4c93; }

@keyframes fall {
  0%   { transform: translateY(-60px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}

.message-box {
  position: relative;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(0, 255, 255, 0.4);
  border-radius: 15px;
  padding: 50px 60px;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: fadeIn 1.5s ease-out;
}

h1 {
  font-size: 1.3rem;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff, 0 0 30px #00cccc;
  margin-bottom: 25px;
  animation: flicker 2s infinite alternate;
}

p {
  font-size: 0.8rem;
  color: #ccc;
  margin-bottom: 25px;
  line-height: 1.6;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.8; text-shadow: 0 0 20px #00ffff; }
}
</style>
