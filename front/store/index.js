import Vuex from 'vuex'
import Cookie from 'js-cookie'

var cookieparser = require('cookieparser')

const createStore = () => {
  return new Vuex.Store({
    state: {
      auth: null
    },
    mutations: {
      update (state, data) {
        state.auth = data;
        Cookie.set('auth', state.auth);
      },
      logout(state){
        state.auth = null;
        Cookie.set('auth', state.auth);
      }
    },
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        let accessToken = null
        if (req.headers.cookie) {
          var parsed = cookieparser.parse(req.headers.cookie)
          accessToken = JSON.parse(parsed.auth)
        }
        commit('update', accessToken)
      }
    }
  })
}

export default createStore
