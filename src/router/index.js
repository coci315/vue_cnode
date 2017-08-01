import Vue from 'vue'
import Router from 'vue-router'
import content from '@/components/content/content'
import topicDetail from '@/components/topic-detail/topic-detail'
import user from '@/components/user/user'
import signin from '@/components/signin/signin'
import createTopic from '@/components/create-topic/create-topic'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/topics/all'
  }, {
    path: '/topic/create',
    name: 'createTopic',
    component: createTopic
  }, {
    path: '/topics/:tab',
    name: 'content',
    component: content,
    children: [
      {
        path: '/topic/:id',
        component: topicDetail
      }
    ]
  }, {
    path: '/user/:loginname',
    name: 'user',
    component: user
  }, {
    path: '/signin',
    name: 'signin',
    component: signin
  }]
})
