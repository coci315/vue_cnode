import {loadFromLocal} from '../common/js/cache'

const state = {
  isSignin: loadFromLocal('ISSIGNIN', false),
  loginname: loadFromLocal('LOGINNAME', ''),
  avatarUrl: loadFromLocal('AVATARURL', ''),
  id: loadFromLocal('ID', ''),
  score: loadFromLocal('SCORE', 0),
  accesstoken: loadFromLocal('ACCESSTOKEN', '')
}

export default state
