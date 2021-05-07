import Vue from 'vue'
import Vuex from 'vuex'

import Request from './util/request'

import {url_get_main_menu} from "./util/api"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // showPageLoading 是否展示页面跳转中间的 loading
    showPageLoading:false,

    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    roleId:localStorage.getItem('roleId') ? localStorage.getItem('roleId') : 3,
    // 是否已登录
    isLogin:!!localStorage.getItem('Authorization'),

    // 编辑页面 根据此字段去更新菜单
    sideMenuNumber:0,
    ifArticleSaved:true,    /**  新增文章 ----- 是否保存了文章 **/
    fullMdEdit:false,       /**  编辑页面 ----- 是否全屏显示编辑器 **/

    // 菜单的数据
    menuData:[],
    curMenuCategory:0,

    // showSkeletonLoader 是否展示页面跳转中间的 loading (骨架样式的loader)
    showSkeletonLoader:false,
    showSkeletonLoaderType:'heading, table-heading, table-thead',

    /** 当前分类的所有版本 **/
    versions:[],
  },
  mutations: {
    // 显示 loading
    modShowPageLoading(state, data) { state.showPageLoading = data; },

    /**
     * 修改token，并将token存入localStorage
     * roleId = 1: 管理员  最高权限
     * roleId = 2: 作者    部分权限   --  只能写自己的权限
     * roleId = 3: 读者    最低权限   --  readonly
     * **/
    changeLogin (state, user) {
      state.Authorization = user.Authorization;
      state.roleId = user.role_id;
      console.log('vuex 登录:',user);
      state.isLogin = true;
      localStorage.setItem('Authorization', user.Authorization);
      localStorage.setItem('roleId', user.role_id);
    },
    loginOut(state){
      state.isLogin = false;
      localStorage.setItem('Authorization', '');
      localStorage.setItem('roleId', '3');
    },

    //  更新菜单数据
    updateMenu(state,payload){ state.menuData = payload },
    //  切换菜单
    changeCurCate(state,payload){ state.curMenuCategory = payload },
    // 更新侧边菜单
    updateSideMenu(state){ state.sideMenuNumber++ },

    /** 正在编辑文章是否已经保存  根据此状态判断能否切换到其他的页面 **/
    updateArticleSaved(state,payload){ state.ifArticleSaved = payload },
    /** 全屏显示 markdown 的编辑器 **/
    updateFullMdEdit(state,payload){ state.fullMdEdit = payload },

    // 是否展示页面跳转中间的 loading (骨架样式的loader)
    modShowSkeletonLoader(state, data) {
      // console.log(state, data,'1111111')
      state.showSkeletonLoader = data.show;
      data.type ? state.showSkeletonLoaderType = data.type : '';
    },
  },
  actions: {

    /* 获取 menu */
    async fetchMenu({ commit, state },payload){
      let fetchData = await Request(url_get_main_menu);
      if(fetchData.data.length){
        commit('updateMenu',fetchData.data)
      }
    }

  },

})
