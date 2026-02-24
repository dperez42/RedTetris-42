import { reactive } from "vue";
import { io } from "socket.io-client";
import store from '../store/index' 

export const state = reactive({
  connected: false,
});

const serverURL = import.meta.env.VITE_SERVER_URL===undefined ? 'http://localhost:3000':import.meta.env.VITE_SERVER_URL;
export const socket = io(serverURL,{extraHeaders: { }})

socket.on("connect", () => {
  state.connected = true;
  if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: socket connected", socket.id)};
  store.commit("games_store/setSocket", socket.id)
});
socket.on("disconnect", () => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: socket disconneted")}
  state.connected = false;
});
socket.on("error", (data) => {
  console.error("SOCKET: ERROR from server:", data)
  if (data.message === 'game_not_found' || data.message === 'player_not_found') {
    alert('La partida ya no existe. Serás redirigido a la página inicial.')
    window.location.href = '/'
  }
});
socket.on("red_tetris_client", async (data) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: RECIEVE",data.data)}
  if (data.command==='info'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: INFO:", data.data)}
  }
  if (data.command==='error'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: ERROR:", data.data)}
    store.commit("error_store/setError", data)
  }
  if (data.command==='update'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: UPDATE:", data.data)}
    store.commit("games_store/setGame", data.data)
  }
  if (data.command==='countdown'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: COUNTDOWN:", data)}
    store.commit("games_store/setCountdown", data)
  }
  if (data.command==='start'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: START:", data)}
    store.commit("games_store/setStart", data)
  }
  if (data.command==='test'){
    if (import.meta.env.VITE_DEBUG==='true'){console.log("SOCKET: TEST:", data)}
  }
});