import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import LogInView from '@/views/LogInView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AddPost from '@/views/AddPost.vue'
import MyPostView from '@/views/MyPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PostView,
      meta:{requiresAuth: true}
    },
    {
      path:'/post',
      name:'Post',
      component:PostView,
      meta:{requiresAuth: true}
    },
    {
      path:'/login',
      name:'LogIn',
      component:LogInView,
    },
    {
      path:'/register',
      name:'Register',
      component:RegisterView,
    },
    {
      path:'/addPost',
      name:'Add_Post',
      component:AddPost,
      meta:{requiresAuth: true}
    },
    {
      path:'/myPost',
      name:'My_Post',
      component:MyPostView,
      meta:{requiresAuth: true}
    }    
  ],
})

router.beforeEach((to, from , next)=>{
  const token= localStorage.getItem('jwtToken');
  if (to.matched.some(record=> record.meta.requiresAuth)) {
    if (!token) {
      next({path:'/login'});
    }else{
      next();
    }
  }else{
    if (token && (to.path === '/login' || to.path === '/register')) {
      next({ path: '/' }); // 重定向到首頁
    } else {
      next(); // 允許訪問不需要身份驗證的頁面
    }
  }
})

export default router
