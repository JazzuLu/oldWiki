<template>
  <v-app id="inspire" v-scroll=''>

    <SideMenu v-show="showSideBar && !fullMdEdit" v-if="$route.name!=='search'" style="z-index: 11"></SideMenu>

    <MainMenu v-show="!fullMdEdit" :style="`z-index: ${$vuetify.breakpoint.mdAndDown ? 2 : 12}`"></MainMenu>

    <v-content :style="{zIndex: `${fullMdEdit ? 5000 :0}`,marginTop:`${$vuetify.breakpoint.mdAndDown ? `56px` : `12px`}`}">
      <pageSkeletonLoader></pageSkeletonLoader>
      <!-- 面包屑 导航 -->
      <v-breadcrumbs v-if="false" :items="routeItems" divider="-" large></v-breadcrumbs>

      <div class="px-4"> <router-view/> </div>
    </v-content>
    <bbNotify :style="`z-index: 10000000`"/>

    <Footer></Footer>
  </v-app>
</template>

<script>

  import GSWhite_img from '@/assets/footer/gongshang_white.png'
  import MainMenu from './MainMenu'
  import SideMenu from './SideMenu'
  import Footer from './Footer'
  import bbNotify from '@/components/bbNotify.vue'
  import {mapState} from 'vuex'
  import pageSkeletonLoader from '@/components/Loading/pageSkeletonLoader.vue'
  /*
  *   网页 骨架 loading 使用方法
  *
  *    // 显示页面 骨架 loading
  *    this.$store.commit('menudata/modShowSkeletonLoader',{show:true, type:type});
  *    or    this.$store.state.menudata.showSkeletonLoader = true;    this.$store.state.menudata.showSkeletonLoaderType = 'type';
  *    // 隐藏 骨架 loading
  *    this.$store.commit('menudata/modShowSkeletonLoader',false);    or    this.$store.state.menudata.showSkeletonLoader = false;
  *
  * */
  export default {
    components:{
      MainMenu,
      bbNotify,
      SideMenu,
      Footer,
      pageSkeletonLoader,
    },
    data: () => ({
      // 工商局的图片
      GSWhite_img,
      routeItems:[],
      showSideBar:true,
    }),
    computed:{
      ...mapState({
        fullMdEdit: state=>state.fullMdEdit,
      }),
    },
    watch:{
      $route(to){
        this.$store.commit('updateFullMdEdit',false);   /** 告诉别人我是不是全屏编辑 **/

        this.showSideBar = to.name !== 'Login';
      }
    },
    mounted() {
      // console.log(this.$route)
      this.showSideBar = this.$route.name !== 'Login'
    }
  }
</script>


<style lang="less">

</style>
