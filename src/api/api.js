import axios from 'axios'
const baseUrl = 'https://cnodejs.org/api/v1/'

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

export function getTopicDetail (id, accesstoken) {
  var url = baseUrl + 'topic/' + id
  if (accesstoken) {
    url += '?accesstoken=' + accesstoken
  }
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}
