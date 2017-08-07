import {loadFromLocal} from '../common/js/cache'

const state = {
  isSignin: loadFromLocal('ISSIGNIN', false),
  loginname: loadFromLocal('LOGINNAME', ''),
  avatarUrl: loadFromLocal('AVATARURL', ''),
  id: loadFromLocal('ID', ''),
  score: loadFromLocal('SCORE', 0),
  accesstoken: loadFromLocal('ACCESSTOKEN', ''),
  theme: loadFromLocal('THEME', 'white'),
  isSaveDraft: loadFromLocal('ISSAVEDRAFT', true),
  isTopicTailOn: loadFromLocal('ISTOPICTAILON', true),
  topicTail: loadFromLocal('TOPICTAIL', '来自vue-cnode')
}

export default state
