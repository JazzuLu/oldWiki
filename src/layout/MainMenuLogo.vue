<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <v-menu offset-y :close-on-content-click="false" v-model="menu" >
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" style="min-width: 100px;height: 48px;padding: 0">
        <img class="mr-3" :src="logo_white" width="40" alt="logo"/>
        <span class="font-weight-light mr-1" style="text-transform: none;">bluebee WIKI</span>
      </v-btn>
    </template>
    <v-expansion-panels v-if="isLogin" accordion style="width: 220px;" class="main_menu_drop" :value="menuData.findIndex(menus=>menus.child.find(i=>i.id==curCateId))">
      <v-expansion-panel v-for="(menus,i) in menuData" :key="i" v-if="menus.child.length">
        <v-expansion-panel-header :class="{mm_drop_h:true,white_expand:true,cur:menus.child.find(mc=>mc.id==curCateId)}" expand-icon="expand_more">
          <div class="mm_drop_h" :title="menus.category_name">{{menus.category_name}}</div>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="pa-0">
          <div v-ripple :class="{mm_drop_inner:true,white_expand:true,cur:curCateId==item.id}" @click="changeCategory(item)"
               v-for="(item, index) in menus.child" :key="index" :title="item.category_name">{{item.category_name}}</div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-menu>

</template>

<script>

  import {mapState,mapMutations,mapActions} from 'vuex'
  import logo_white from '../assets/logo_white.png'


  export default {
    components:{
    },
    props:{
      menuData:{ type:Array,default(){return []} },

      curCateId:{ type:Number,default(){return 3} },
    },
    data:()=>({
      logo_white,
      menu:false,
    }),
    watch:{
    },
    async mounted() {
    },
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin
      })
    },
    methods:{
      ...mapMutations(['changeLogin','loginOut','updateMenu','changeCurCate']),

      // 切换菜单 跳转
      changeCategory(cate){
        this.changeCurCate(cate);
        this.$router.push('/?categoryId='+cate.id);
        this.menu = false;
      },
    }
  }
</script>

<style lang="less">
  @link_color:        #428bca; // sea blue

  .white_expand{white-space: nowrap; overflow: hidden; text-overflow: ellipsis;width: 100%;}

  .main_menu_drop .v-expansion-panel-header{padding: 12px 20px;min-height: 10px;}
  .main_menu_drop .v-expansion-panel--active .v-expansion-panel-header{padding: 18px 20px;min-height: 10px;}
  .main_menu_drop .v-expansion-panel-content__wrap{padding: 0;}
  .main_menu_drop .mm_drop_inner{text-transform: none;font-size: 12px;width: 100%;line-height: 32px;cursor: pointer;padding-left: 30px;padding-right: 20px;}
  .main_menu_drop .mm_drop_inner.cur{background-color: #ddd;}
  .main_menu_drop .mm_drop_h{ width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  .main_menu_drop .mm_drop_h.cur{background-color: #eee;}

</style>
