import Vue from 'vue'
import Router from 'vue-router'

import Layout from './layout/Layout'
import Home from './views/Home/Home'
import MdEdit from './views/MdEdit/MdEdit'
import Search from './views/SearchList/SearchList'
import GroupList from './views/Group/GroupList'
import GroupDetail from './views/Group/GroupDetail'
import Login from './views/Login/Login'
import Page404 from './views/page404/page404'
import Page403 from './views/page404/page403'
import PageError from './views/page404/pageError'
import TestView from './views/Test/TestView'
import Request from "./util/request";
import {url_get_main_menu} from "./util/api";

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children:[
        { path: '/', name: 'home', component: Home, },
        { path: '/MdEdit', name: 'MdEdit', component: MdEdit },
        { path: '/MdEdit/:mdId', name: 'MdEdit', component: MdEdit },

        { path: '/search', name: 'search', component: Search }, /** 搜索页面 **/

        { path: '/group', name: 'GroupList', component: GroupList },
        { path: '/group/:groupId', name: 'GroupDetail', component: GroupDetail },

      ]
    },
    { path: '/login', name: 'Login', component: Login },

    { path:'*', name: 'page404',  component: Page404 },
    { path:'/403', name: 'page403', component: Page403 },
    { path:'/error', name: 'error', component: PageError },
    { path:'/test', name: 'test', component: TestView },
    /*{
      path: '/Home',
      name: 'Home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/!* webpackChunkName: "about" *!/ './views/Home/Login.vue')
    }*/
  ]
});

router.beforeEach(async (to, from, next) => {
  //设置标题
  // document.title = to.meta.title || 'bluebeeX'
  next();
  // console.log(  localStorage.getItem('Authorization'))

  if(to.name!=='login'){
    /* 获取 menu */
    let fetchData = await Request(url_get_main_menu);
    if(fetchData.status==401){
      router.replace('/login')
    }
  }

  if(!localStorage.getItem('Authorization')){
    router.replace('/login')
  }

});

export default router
