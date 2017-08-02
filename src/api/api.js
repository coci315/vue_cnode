import axios from 'axios'
const baseUrl = 'https://cnodejs.org/api/v1/'

// 获取主题首页
export function getTopics (tab, limit, page) {
  const url = baseUrl + 'topics'
  const params = {
    tab,
    limit,
    page
  }
  return axios.get(url, {
    params
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取主题详情
export function getTopicDetail (id, accesstoken, mdrender) {
  var url = baseUrl + 'topic/' + id
  if (accesstoken) {
    url += '?accesstoken=' + accesstoken
  }
  if (mdrender != null) {
    const index = url.indexOf('?')
    url += (index > -1) ? ('&mdrender=' + mdrender) : ('?mdrender=' + mdrender)
  }
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

// 新建主题
export function createTopic (accesstoken, title, tab, content) {
  const url = baseUrl + 'topics'
  return axios.post(url, {
    accesstoken,
    title,
    tab,
    content
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 编辑主题
export function editTopic (accesstoken, topic_id, title, tab, content) {
  const url = baseUrl + 'topics/update'
  return axios.post(url, {
    accesstoken,
    topic_id,
    title,
    tab,
    content
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 新建评论
export function createReply (topic_id, accesstoken, content, reply_id) {
  const url = baseUrl + 'topic/' + topic_id + '/replies'
  const body = reply_id ? {accesstoken, content, reply_id} : {accesstoken, content}
  return axios.post(url, body).then(res => {
    return Promise.resolve(res.data)
  })
}

// 为评论点赞
export function upOrDownReply (reply_id, accesstoken) {
  const url = baseUrl + 'reply/' + reply_id + '/ups'
  return axios.post(url, {accesstoken}).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取用户详情
export function getUserDetail (loginname) {
  const url = baseUrl + 'user/' + loginname
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

// 登录
export function signin (accesstoken) {
  const url = baseUrl + 'accesstoken'
  return axios.post(url, {accesstoken}).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取用户收藏的主题
export function getTopicCollect (loginname) {
  const url = baseUrl + 'topic_collect/' + loginname
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

// 收藏主题
export function collectTopic (accesstoken, topic_id) {
  const url = baseUrl + 'topic_collect/collect'
  return axios.post(url, {
    accesstoken,
    topic_id
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 取消收藏主题
export function cancelCollectTopic (accesstoken, topic_id) {
  const url = baseUrl + 'topic_collect/de_collect'
  return axios.post(url, {
    accesstoken,
    topic_id
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取未读消息数
export function getMessageCount (accesstoken) {
  const url = baseUrl + 'message/count'
  const params = {accesstoken}
  return axios.get(url, {
    params
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取已读和未读消息
export function getMessages (accesstoken) {
  const url = baseUrl + 'messages'
  const params = {accesstoken}
  return axios.get(url, {
    params
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 标记全部已读
export function markAll (accesstoken) {
  const url = baseUrl + 'message/mark_all'
  return axios.post(url, {accesstoken}).then(res => {
    return Promise.resolve(res.data)
  })
}

// 标记单个消息为已读
export function markOne (msg_id, accesstoken) {
  const url = baseUrl + 'message/mark_one/' + msg_id
  return axios.post(url, {accesstoken}).then(res => {
    return Promise.resolve(res.data)
  })
}
