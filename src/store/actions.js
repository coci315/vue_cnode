import * as types from './mutation-types'
import {saveSignin, saveSignout, saveScore, saveTheme, saveDraftSetting, saveTopicTailSetting, saveTopicTail} from '../common/js/cache'

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

export const saveTheTheme = function ({commit}, theme) {
  saveTheme(theme)
  commit(types.SET_THEME, theme)
}

export const saveTheDraftSetting = function ({commit}, isSaveDraft) {
  saveDraftSetting(isSaveDraft)
  commit(types.SET_ISSAVEDRAFT, isSaveDraft)
}

export const saveTheTopicTailSetting = function ({commit}, isTopicTailOn) {
  saveTopicTailSetting(isTopicTailOn)
  commit(types.SET_ISTOPICTAILON, isTopicTailOn)
}

export const saveTheTopicTail = function ({commit}, topicTail) {
  saveTopicTail(topicTail)
  commit(types.SET_TOPICTAIL, topicTail)
}
