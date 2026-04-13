export default {
    namespaced: true,
    state:{
        error:'OK',
    },
    // Mutations are responsible for changing state
    mutations: {
        setError(state, error) {
            console.log("change error", error)
            state.error = error
        },
    },
    actions: {
    },
    // getters are use to retrieve state data this.$store.getters['game/getTetris'];
    getters: {
        getError: state => state.error
    }
}