<template>
  <div>
    <router-view v-if="isRouterAlive"></router-view>
    <pageLoading :show="showPageLoading"/>

    <bbNotify :style="`z-index: 10000000`"/>

  </div>
</template>

<script>
  import Layout from './layout/Layout';
  import pageLoading from '@/components/Loading/pageLoading.vue'
  import {mapState} from 'vuex'
  import bbNotify from '@/components/bbNotify.vue'

  /*
  *   网页 loading 使用方法
  *    // 显示页面 loading
  *    this.$store.commit('modShowPageLoading',true);
  *    // 隐藏 loading
  *    this.$store.commit('modShowPageLoading',false);
  *
  *    // 显示页面 骨架 loading
  *    this.$store.commit('modShowSkeletonLoader',{show:true, type:type});
  *    or    this.$store.state.showSkeletonLoader = true;    this.$store.state.showSkeletonLoaderType = 'type';
  *    // 隐藏 骨架 loading
  *    this.$store.commit('modShowSkeletonLoader',false);    or    this.$store.state.showSkeletonLoader = false;
  *
  *   刷新页面的方法
        name: "MainMenu",
        inject:['reload'],    《=====加上这一句 与 name/method/mount 同级
  *     同时 在需要刷新页面的代码块里写上
  *     this.reload();
  *
  * */

  export default {
    name: 'App',
    components: {
      Layout,
      pageLoading,
      bbNotify,
    },
    computed: {
      ...mapState({
        // 页面跳转的loading
        showPageLoading: state => state.showPageLoading,
      }),
    },
    provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
      return {
        reload: this.reload
      }
    },
    data: () => ({
      isRouterAlive: true                    //控制视图是否显示的变量
    }),
    mounted(){
    },
    methods: {
      reload () {
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          this.isRouterAlive = true;         //再打开
        })
      },
    }
  };
</script>

<style lang='less'>
  .v-label{font-size: 13px!important;}
  .excess_word{white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}

  /* alert 的背景颜色 */
  .success { background-color: #4caf50!important; border-color: #4caf50!important; }
  .info { background-color: #2196f3!important; border-color: #2196f3!important; }
  .warning { background-color: #fb8c00!important; border-color: #fb8c00!important; }
  .error { background-color: #ff5252!important; border-color: #ff5252!important; }

  /*滚动条样式*/
  *::-webkit-scrollbar {
    width: 6px; height: 6px;
    &:hover {
      width: 6px; height: 6px;
    }
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
    &:hover {
      cursor: pointer;
      background-color: #90cdee;
    }
    &:active {
      background-color: #0077be;
    }
  }

  *::-webkit-scrollbar-track { background-color: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.1); }
  *::-webkit-scrollbar-button { display: none; }

</style>
