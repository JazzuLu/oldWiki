<template>
<!--    该 Menu 下的标题    -->
  <v-toolbar flat class="transparent ">
    <div class="w-100 d-flex align-center justify-space-between">
      <div v-if="!sideBarMini" style="display: flex;align-items: center;width: calc(100% - 56px);">
        <div class="white_expand title" style="width: calc(100% - 50px);" :title="curCategory.category_name">{{curCategory.category_name}}</div>
        <v-menu offset-y contentClass="side_menu_version_dia">
          <template v-slot:activator="{ on, attrs }"> <v-btn small text v-on="on" v-bind="attrs" style="padding: 0;">{{curVersion.version}}</v-btn> </template>
          <v-list dense class="py-0">
            <v-list-item v-for="i in versionArr" :key="i.id" style="min-height: 32px;" @click="changeVersion(i)">
              <v-list-item-title>{{i.version}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else class="title font-weight-black text-center" style="margin-left: 4px;">{{curCategory.category_name.slice(0, 1)}}</div>
      <div v-if="!sideBarMini">
        <v-btn icon @click="addNewArticle" small v-if="isLogin && Number(roleId)!==3" title="Add New Article"> <v-icon>add</v-icon> </v-btn>
        <v-btn v-if="!$vuetify.breakpoint.mdAndDown" icon small title="Sidebar Mini" @click="toggleSideBig"> <v-icon>{{sideBarMini?'more_vert':'view_list'}}</v-icon> </v-btn>
      </div>
    </div>
  </v-toolbar>
</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import { cloneDeep,find } from 'lodash'

  import {
    url_version,
  } from '../util/api'

  export default {
    components:{
    },
    props: {
      curCategory:{type:Object, default:()=>({category_name:''})},  /** 当前文章类别的 所有信息 **/
      categoryId:{type:[String,Number], default:()=>0},   /** 当前文章类别的 id **/
      sideBarMini:{type:Boolean, default:()=>false},      /** 是否收缩侧边栏 **/
    },
    data: () => ({
      /** 关于版本 **/
      versionArr:[],
      curVersion:{version:''},
    }),
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin,
        roleId: state=>state.roleId,
      }),
    },
    watch:{
      categoryId:{
        handler(nv,ov){
          console.log('curCategory',nv)
          if(nv) this.fetchVersion();
        },immediate:true,
      }
    },
    async mounted() {
    },
    methods:{
      toggleSideBig(){ this.$emit('toggleSideBig'); },
      addNewArticle(){ this.$emit('addNewArticle'); },


      async fetchVersion(){
        let versionList = await this.$fetch(url_version,{category_id:this.curCategory.id},'get');
        if(versionList.status)return;

        let version = JSON.parse(sessionStorage.getItem('version'));
        this.$store.state.versions = versionList.data;
        this.versionArr = versionList.data;
        this.curVersion = version && version.categoryId == this.curCategory.id ? version : versionList.data[0];
        this.saveVersion();
      },
      changeVersion(item){
        console.log('changeVersion',item)
        this.curVersion = item;
        this.saveVersion();
        this.$emit('changeVersion',item);
      },
      saveVersion(){
        let versionMes = {...this.curVersion,categoryId:this.curCategory.id};
        sessionStorage.setItem('version',JSON.stringify(versionMes));
      }

    },
  }
</script>


<style lang="less">
  .side_menu_version_dia.v-menu__content{z-index: 15!important;}
</style>
