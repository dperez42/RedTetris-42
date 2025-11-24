export default {
    namespaced: true,
    state:{
        game:null,
        socket: null,
        example_board: null,
    },
    // Mutations are responsible for changing state
    mutations: {
        setGame(state, game) {
            state.game = game ? { ...game } : null;  // replace reference completely        
        },
        
        setSocket(state, socket){
            state.socket = socket
        },
        setCountdown(state, data){
            state.game.intervalCountdown = data.intervalCountdown
            state.game.isCountdown = data.isCountdown
            state.game.countdown = data.countdown
        },
        setStart(state, data){
            state.game.isStart = data.isStart
        }
    },
    actions: {

    },
    // getters are use to retrieve state data this.$store.getters['game/getTetris'];
    getters: {
        getSocket: state => state.socket,
        getGame: state => state.game
    }
}