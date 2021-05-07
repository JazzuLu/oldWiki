import 'material-design-icons-iconfont/dist/material-design-icons.css'  //icon front
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import fetchData from './util/request';
import 'jquery-ui-dist/jquery-ui'
import 'jquery-ui-dist/jquery-ui.css'
import './util/directives.js'    /** 引入指令 **/

// 全局注册
// import with ES6
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// toast 插件
import Notifications from 'vue-notification'

// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 打印组件
import Print from 'vue-printjs'

/** 网页转 pdf **/
import htmlToPdf from './util/htmlToPDF'

Vue.use(htmlToPdf)
// vue打印
Vue.use(Print)

Vue.use(ElementUI);

Vue.use(Notifications)

// use markdown 编辑器
Vue.use(mavonEditor)

Vue.prototype.$fetch = fetchData

Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
