import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/FirstPage.vue')
  },
  {
    path: '/nav',
    name: 'nav',
    component: () => import('@/views/NavPage.vue')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/views/sign/index.vue')
  },
  {
    path: '/sign/userinfo',
    name: 'signUserinfo',
    component: () => import('@/views/sign/userinfo.vue')
  },
  {
    path: '/sign/chatroom',
    name: 'signChatroom',
    component: () => import('@/views/sign/chatroom.vue')
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: () => import('@/views/admin/login.vue')
  },
  {
    path: '/admin',
    name: 'adminIndex',
    component: () => import('@/views/admin/index.vue')
  },
  {
    path: '/admin/peopleList',
    name: 'adminPeopleList',
    component: () => import('@/views/admin/peopleList.vue')
  },
  {
    path: '/admin/rosterList',
    name: 'adminRosterList',
    component: () => import('@/views/admin/rosterList.vue')
  },
  {
    path: '/admin/winnerList',
    name: 'adminWinnerList',
    component: () => import('@/views/admin/winnerList.vue')
  },
  {
    path: '/admin/lottery',
    name: 'adminLottery',
    component: () => import('@/views/admin/lottery.vue')
  },
  {
    path: '/admin/lottery2',
    name: 'adminLottery2',
    component: () => import('@/views/admin/lottery2.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
