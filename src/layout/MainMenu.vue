<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-app-bar flat dark app class="wiki_menu px-5" dense clipped-left style="background-color: #000;z-index: 11;">

      <v-toolbar-title style="display: flex;cursor: pointer;" class="align-center">
        <MainMenuLogo :menuData="menuData" :curCateId="curCateId"></MainMenuLogo>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!--   顶部菜单区域   -->
      <v-toolbar-items v-if="isLogin && !$vuetify.breakpoint.mdAndDown" style="width: 410px;padding-top:6px;margin-left: -150px;">
        <v-text-field class="mm_search_ipt" :dense="true" height="30" label="Regular" placeholder="Searching" prepend-inner-icon="search" solo
                      v-model="searchText" @click:prepend-inner="subSearch" @keyup.enter="subSearch"></v-text-field>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-btn icon v-if="!isLogin" title="登录" to="/login"> <v-icon>person</v-icon> </v-btn>
      <v-btn icon v-if="isLogin" title="登出" @click="outLogin"> <v-icon>power_settings_new</v-icon> </v-btn>
      <v-btn icon v-if="Number(roleId)==1" title="用户组" to="/group" activeClass="group_active"> <v-icon>group</v-icon> </v-btn>

    </v-app-bar>

    <v-app-bar v-if="$vuetify.breakpoint.mdAndDown" flat app class="wiki_menu px-5" dense clipped-left color="primary" style="margin-top: 48px">
      <!--   顶部菜单区域   -->
      <v-toolbar-items style="width: 410px;padding-top:6px;margin: 0 auto;">
        <v-text-field class="mm_search_ipt" color="primary" :dense="true" height="30" label="Regular" placeholder="Searching" prepend-inner-icon="search" solo
                      v-model="searchText" @click:prepend-inner="subSearch" @keyup.enter="subSearch"></v-text-field>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
  import TopMenu from './TopMenuList'
  import MainMenuLogo from './MainMenuLogo'

  import {url_get_main_menu} from '../util/api'
  import logo_white from '../assets/logo_white.png'
  import {mapState,mapMutations,mapActions} from 'vuex'

  //  测试数据
  const menu = [
    {
      id:'01',
      category_name:'bluebee X',
      child:[{
        id:'0101',
        category_name:'Analysis1',
      },{
        id:'0102',
        category_name:'Analysis2',
      },{
        id:'0103',
        category_name:'Analysis3',
      }]
    },{
      id:'02',
      text:'bluebee X',
      child:[{
        id:'0101',
        category_name:'Analysis1',
      },{
        id:'0102',
        text:'Analysis2',
        category_name:'business',
      }]
    }
  ];

  export default {
    name: "MainMenu",
    inject:['reload'],
    components:{
      TopMenu,
      MainMenuLogo,
    },
    created(){

    },
    data:()=>({
      menuData:[],
      logo_white,

      curCateId:3,

      /** 需要搜索的文本 **/
      searchText:'',
    }),
    async mounted() {
      this.initMenu();
      console.log(this.$vuetify.breakpoint)

      // this.curCateId = Number(this.$route.query.categoryId || this.menuData[0].child[0].id);
    },
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin,
        roleId: state=>state.roleId,
      })
    },
    watch:{
      $route:{
        handler(to){
          if(this.menuData.length){
            this.curCateId = Number(this.$route.query.categoryId || this.menuData[0].child[0].id);
          }

          /** 如果是搜索页面 则填上搜索框的值 **/
          if(to.name==='search'){ this.searchText = to.query.s || ''; this.curCateId = null; }else{ this.searchText = ''; }
          // this.searchText = to.name==='search' ? to.query.s || '' : '';
        },
        immediate:true,
      },
      '$vuetify.breakpoint.name'(nv){
        this.reload();
      }
    },
    methods:{
      ...mapMutations(['changeLogin','loginOut','updateMenu','changeCurCate']),
      // ...mapActions(['fetchMenu']),
      async initMenu(){

        // if(!sessionStorage.getItem('menuData')){
          let fetchData = await this.$fetch(url_get_main_menu);
          if(fetchData.data.length){
            this.menuData = fetchData.data;
            sessionStorage.setItem('menuData',JSON.stringify(fetchData.data));
            this.$store.state.menuData = fetchData.data;
            this.curCateId = this.$route.query.categoryId || fetchData.data[0].child[0].id;
            this.updateMenu(fetchData.data);
          }
        // }else {
        //   this.menuData = JSON.parse(sessionStorage.getItem('menuData'));
        //   this.$store.state.menuData = this.menuData;
        // }

      },


      // 退出登录
      outLogin(){
        this.$confirm('退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          this.loginOut();
          this.$notify({type: 'success', title: '退出登录成功', text: ''});
          this.$router.push('/login')
        })
      },

      /** 上传搜索文字 **/
      subSearch(){
        if(this.searchText)
          this.$router.push(`/search?s=${this.searchText}`)
      }

    }
  }
</script>

<style>
  .wiki_menu .v-toolbar__content{padding: 0;}

  .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active.group_active:before{opacity: 0;}

  .fix-w1200{width: 1200px;margin: 0 auto;}

  .wiki_menu .mm_search_ipt{border-radius: 50px;}
  .wiki_menu .mm_search_ipt .v-input__slot{height: 36px;}
  .wiki_menu .mm_search_ipt.v-text-field .v-input__control {min-height: 36px;}

</style>
