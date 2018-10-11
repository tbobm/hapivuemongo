import Vuex from 'vuex'
import Cookie from 'js-cookie'

var cookieparser = require('cookieparser')

const createStore = () => {
  return new Vuex.Store({
    state: {
      auth: null,
      crimeField: {
        "_id": {
          "type": "text",
          "required": true,
          "editable": false
        },
        "weapontype": {
          "editable": true,
          "required": true,
          "type": "text"
        },
        "location": {
          "required": true,
          "type": "text",
          "editable": true
        },
        "incident_type_description": {
          "type": "text",
          "required": true,
          "editable": true
        },
        "reptdistrict": {
          "required": true,
          "type": "text",
          "editable": true
        },
        "main_crimecode": {
          "type": "text",
          "required": true,
          "editable": true
        },
        "shooting": {
          "required": false,
          "type": "checkbox",
          "editable": true
        },
        "compnos": {
          "editable": true,
          "required": true,
          "type": "number"
        },
        "domestic": {
          "editable": true,
          "type": "checkbox",
          "required": false
        },
        "streetname": {
          "type": "text",
          "required": true,
          "editable": true
        },
        "reportingarea": {
          "type": "number",
          "required": true,
          "editable": true
        },
        "shift": {
          "editable": true,
          "type": "text",
          "required": true
        },
        "x": {
          "editable": true,
          "required": true,
          "type": "number"
        },
        "fromdate": {
          "type": "text",
          "required": true,
          "editable": true
        },
        "month": {
          "editable": true,
          "type": "number",
          "required": true
        },
        "day_week": {
          "editable": true,
          "type": "text",
          "required": true
        },
        "year": {
          "editable": true,
          "required": true,
          "type": "number"
        },
        "xstreetname": {
          "required": true,
          "type": "text",
          "editable": true
        },
        "naturecode": {
          "editable": true,
          "type": "text",
          "required": true
        },
        "ucrpart": {
          "editable": true,
          "required": true,
          "type": "text"
        },
        "y": {
          "editable": true,
          "required": true,
          "type": "number"
        }
      }
    },
    mutations: {
      update(state, data) {
        state.auth = data;
        Cookie.set('auth', state.auth);
      },
      logout(state) {
        state.auth = null;
        Cookie.set('auth', state.auth);
      }
    },
    actions: {
      nuxtServerInit({commit}, {req}) {
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
