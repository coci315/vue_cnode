export function saveToLocal (key, value) {
  let cnode = window.localStorage.__cnode__
  if (!cnode) {
    cnode = {}
  } else {
    cnode = JSON.parse(cnode)
  }
  cnode[key] = value
  window.localStorage.__cnode__ = JSON.stringify(cnode)
}

export function loadFromLocal (key, def) {
  let cnode = window.localStorage.__cnode__
  if (!cnode) {
    return def
  }
  cnode = JSON.parse(cnode)
  let ret = cnode[key]
  return ret === undefined ? def : ret
}

export function saveSignin ({loginname, avatar_url, id, accesstoken}) {
  saveToLocal('ISSIGNIN', true)
  saveToLocal('LOGINNAME', loginname)
  saveToLocal('AVATARURL', avatar_url)
  saveToLocal('ID', id)
  saveToLocal('ACCESSTOKEN', accesstoken)
}

export function saveSignout () {
  saveToLocal('ISSIGNIN', false)
  saveToLocal('LOGINNAME', '')
  saveToLocal('AVATARURL', '')
  saveToLocal('ID', '')
  saveToLocal('ACCESSTOKEN', '')
}

export function saveScore (score) {
  saveToLocal('SCORE', score)
}
