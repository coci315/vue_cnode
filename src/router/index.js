import Vue from 'vue'
import Router from 'vue-router'
import content from '@/components/content/content'
import topicDetail from '@/components/topic-detail/topic-detail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/topics/all'
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
  }]
})
