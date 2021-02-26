import Vue from 'templates/vue/src/node_modules/vue'
import Router from 'templates/vue/src/router/node_modules/vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/app-vue',
  routes: [
    {
      path: '/',
      component: () =>
        import(/* webpackChunkName: "home" */ '@/pages/Home.vue'),
      meta: { title: 'Home' }
    }
  ]
})
