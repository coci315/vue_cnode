import * as types from './mutation-types'

const mutations = {
  [types.SET_ISSIGNIN] (state, isSignin) {
    state.isSignin = isSignin
  },
  [types.SET_LOGINNAME] (state, loginname) {
    state.loginname = loginname
  },
  [types.SET_AVATARURL] (state, avatarUrl) {
    state.avatarUrl = avatarUrl
  },
  [types.SET_ID] (state, id) {
    state.id = id
  }
}

export default mutations
