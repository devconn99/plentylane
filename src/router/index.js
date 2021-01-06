import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
      path: '/how-it-works',
      name: 'HowItWorks',
      component: () => import('../views/HowItWorks.vue')
  },
  {
      path: '/pricing',
      name: 'Pricing',
      component: () => import('../views/Pricing.vue')
  },
  {
      path: '/faqs',
      name: 'FAQs',
      component: () => import('../views/FAQs.vue')
  },
  {
      path: '/food-safety',
      name: 'FoodSafety',
      component: () => import('../views/FoodSafety.vue')
  },
  {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
  },
  {
      path: '/sign-up',
      name: 'SignUp',
      component: () => import('../views/SignUp.vue')
  },
  {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
