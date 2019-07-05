import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TaskEntries from '@/components/TaskEntries'
import LogTask from '@/components/LogTask'
import Login from '@/components/Login'
import firebase from 'firebase'
import store from '../store.js'

Vue.use(Router)

const router =  new Router({
  mode:'history',
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path:'/login',
      name:'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/task-entries',
      name: 'tast entries',
      component: TaskEntries,
      meta: {
        requiresAuth: true,
        requiresDate: true
      },
      children: [
        {path:'log-task', component: LogTask}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser

  const requiresDate = to.matched.some(x => x.meta.requiresDate)

  // console.log("router:")
  // console.log(currentUser)
  // console.log(requiresAuth)

  if(requiresAuth && !currentUser) {
    next('/login')
  } else if(requiresDate && !store.state.selectedDate) {
    next(from)
  }else {
    next()
  }
})

export default router;