import Vue from 'vue'
import Router from 'vue-router'

import home from '../pages/home/index.vue'
import login from '../pages/login/index.vue'
import editor from '../pages/editor/index.vue'
import userDetails from '../pages/userDetails/index.vue'
import articleList from '../pages/articleList/index.vue'


import cover from '../pages/cover/cover.vue'




Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: () => {
        return 'login';
      },
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
    },
    {
      path: '/editor',
      name: 'editor',
      component: editor,
    },
    {
      path: '/userDetails',
      name: 'userDetails',
      component: userDetails,
    },
    {
      path: '/articleList',
      name: 'articleList',
      component: articleList,
    },
    {
      path: '/cover',
      name: 'cover',
      component: cover, 
    },
  ]
})
