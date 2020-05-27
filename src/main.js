import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import layout from './components/layout/index'



Vue.component('layout',layout);

Vue.use(ElementUI)


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  next()
});
const v = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export default v