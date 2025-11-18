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
  console.log("info: socket connected", socket.id);
  store.commit("games_store/setSocket", socket.id)
});
socket.on("disconnect", () => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log("socket disconneted")}
  // remove player from games
  //getGame_socketId(socket_id
  // del player in game
  state.connected = false;
});
socket.on("red_tetris_client", async (data) => {
  if (import.meta.env.VITE_DEBUG==='true'){console.log(data.data)}
  if (data.command==='info'){
    console.log("info:", data.data)
  }
  if (data.command==='error'){
    console.log("ERROR:", data.data)
    store.commit("error_store/setError", data)
  }
  if (data.command==='update'){
    console.log("update")
    store.commit("games_store/setGame", data.data)
  }
  if (data.command==='countdown'){
    console.log("countdown", data)
    store.commit("games_store/setCountdown", data)
  }
  if (data.command==='start'){
    console.log("start", data)
    store.commit("games_store/setStart", data)
  }
  if (data.command==='test'){
    console.log("test:", data)
    //store.commit("games_store/setGame", data.data)
  }
});