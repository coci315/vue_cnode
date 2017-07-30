import * as types from './mutation-types'

export const signin = function ({commit}, {loginname, avatar_url, id}) {
  commit(types.SET_ISSIGNIN, true)
  commit(types.SET_LOGINNAME, loginname)
  commit(types.SET_AVATARURL, avatar_url)
  commit(types.SET_ID, id)
}

export const signout = function ({commit}) {
  commit(types.SET_ISSIGNIN, false)
  commit(types.SET_LOGINNAME, '')
  commit(types.SET_AVATARURL, '')
  commit(types.SET_ID, '')
}
