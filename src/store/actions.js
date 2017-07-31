import * as types from './mutation-types'
import {saveSignin, saveSignout, saveScore} from '../common/js/cache'

export const signin = function ({commit}, {loginname, avatar_url, id, accesstoken}) {
  saveSignin({loginname, avatar_url, id, accesstoken})
  commit(types.SET_ISSIGNIN, true)
  commit(types.SET_LOGINNAME, loginname)
  commit(types.SET_AVATARURL, avatar_url)
  commit(types.SET_ID, id)
  commit(types.SET_ACCESSTOKEN, accesstoken)
}

export const signout = function ({commit}) {
  saveSignout()
  commit(types.SET_ISSIGNIN, false)
  commit(types.SET_LOGINNAME, '')
  commit(types.SET_AVATARURL, '')
  commit(types.SET_ID, '')
  commit(types.SET_ACCESSTOKEN, '')
}

export const saveTheScore = function ({commit}, score) {
  saveScore(score)
  commit(types.SET_SCORE, score)
}
