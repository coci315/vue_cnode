import Vue from 'vue'
import Router from 'vue-router'
import content from '@/components/content/content'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/topics/all'
  }, {
    path: '/topics/:tab',
    name: 'content',
    component: content
  }]
})
