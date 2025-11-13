import { createStore} from 'vuex'
import games_store from './games_store'
export default createStore({
    modules: {
        games_store,
    }
})