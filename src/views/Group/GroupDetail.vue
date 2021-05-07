<template>
  <div class="df_content">
    <v-layout wrap justify-start>
      <!--  表头  -->
      <v-flex xs12>
        <v-layout row align-center justify-space-between>
          <v-flex class="ml-3 gs_top_icon" transition="slide-x-transition">
            <div class="fl"> <v-img width="60" :src="icon"></v-img> </div>
            <div class="fl ml-2">
              <div class="title primary--text">用户组</div>
              <div class="body-1 grey--text">{{groupData.name}}</div>
            </div>
          </v-flex>

          <span v-if="groupsId>0" class="caption grey--text">ID&ensp;{{groupsId}}</span>
          <v-divider v-if="groupsId>0" vertical class="mx-3 my-0"></v-divider>

          <v-btn small outlined class="mr-4 animated fadeInDown" to="/group"> <i class="material-icons">arrow_back</i> </v-btn>
          <v-btn small class="mr-4 success px-3" @click="updateGroup" :disabled="!isUpdate">
            <i class="material-icons mr-3">check</i> <span class="caption">更新</span>
          </v-btn>
        </v-layout>
      </v-flex>

      <!--  body  -->
      <v-flex xs12 pa-2>
        <div class="mt-3 elevation-3 ged_tabs" style="border-radius: 4px;overflow: hidden">
          <v-tabs v-model='tab' background-color="primary" dark fixed-tabs show-arrows>

            <v-tab key='general'>基础信息</v-tab>
            <v-tab key='rules'>组权限</v-tab>
            <v-tab key='users'>用户列表</v-tab>

            <!--  通用  -->
            <v-tab-item class="pa-3" key='general' :transition='false' :reverse-transition='false'>
              <v-text-field dense label="用户组" outlined prepend-icon='group' v-model="groupData.name" @input="isUpdate=true" height="40" hide-details></v-text-field>
            </v-tab-item>

            <!--  组权限  -->
            <v-tab-item class="pa-0" key='rules' :transition='false' :reverse-transition='false'>
              <v-treeview dense selectable selected-color="dark" v-model="groupData.permission" @input="isUpdate=true" :items="menuList" item-children="child" item-text="category_name"></v-treeview>
            </v-tab-item>

            <!--  用户列表  -->
            <v-tab-item class="bbx_datagrid" key='users' :transition='false' :reverse-transition='false'>
              <v-data-table v-model="checkedUser" @item-selected="isUpdate=true" :headers="headers" :items="userList" item-key="id" show-select class="elevation-1"></v-data-table>
            </v-tab-item>

          </v-tabs>
        </div>
      </v-flex>

    </v-layout>
  </div>
</template>

<script>

  import logoIcon from '@/assets/group/icon-people.svg'

  import {cloneDeep,find,uniqBy} from 'lodash'
  import {
    url_save_group,
    url_get_main_menu,
    url_group_detail,
    url_user_list,

  } from '../../util/api'

  export default {
    name: "GeneralSetting",
    components:{
    },
    data(){
      return{
        icon:logoIcon,
        groupsId:1,
        tab:'general',

        isUpdate:false,
        // 后台拿到的 group 信息
        groupData:{ name:'', permission:[] },


        menuList:[],      /** 关于组权限 **/

        userList:[],      /** 关于组下面的用户 **/
        headers: [],      /** 关于组下面的用户表头 **/
        checkedUser: [],      /** 关于组下面的用户表头 **/
      }
    },
    computed:{

    },
    mounted() {

    },
    async created () {
      // 获取页面数据
      this.headers = [
        { text: '#', align: 'start', sortable: true, value: 'id', },
        { text: '名称', value: 'name' },
      ];

      await this.getAllMenu();
      await this.getAllUser();
      await this.getDefaultData();
    },
    methods:{
      // 获取页面默认数据
      async getDefaultData(){
        this.groupsId = this.$route.params.groupId;
        if(this.groupsId<0) return;
        let listData = await this.$fetch(url_group_detail,{role_id:this.groupsId});
        this.groupData = listData.data;
        let menuParents = this.menuList.map(ml=>ml.id);   /** 去掉所有的父级 id **/
        this.groupData.permission = this.groupData.permission.filter(p=>!menuParents.find(mp=>mp==p));
        this.checkedUser = this.userList.filter(i=>this.groupData.user_list.find(ul=>ul==i.id));
      },
      async getAllMenu(){
        this.groupsId = this.$route.params.groupId;
        let listData = await this.$fetch(url_get_main_menu,{is_all:'1'});
        this.menuList = listData.data;
      },
      async getAllUser(){
        this.groupsId = this.$route.params.groupId;
        let listData = await this.$fetch(url_user_list);
        this.userList = listData.data;
      },


      /** 保存数据 **/
      async updateGroup(){
        /** 找到父级节点 **/
        let cate_list = [...this.groupData.permission];
        this.menuList.forEach(ml=>{
          ml.child.forEach(mc=>{
            if(cate_list.find(cl=>cl==mc.id)) cate_list.push(ml.id);
          })
        });
        cate_list = uniqBy(cate_list);
        let params = {
          id:this.groupsId<0 ? undefined : this.groupsId,
          group_name:this.groupData.name,
          user_list:this.checkedUser.map(i=>i.id),
          cate_list,
        };
        if(!this.groupData.name){ this.$notify({type:'error',text:'请填写名称'}); return; }

        let fetchList = await this.$fetch(url_save_group,params,'post');
        if (fetchList.status){ this.$notify({type:'error',text:'保存失败'}); return; }
        this.$notify({type:'success',text:'保存成功'});
        this.isUpdate = false;
      }

    },


  }

</script>

<style lang="less">

  .df_content{height: 100%;display: flex;align-items: flex-start;width: 100%;}

  .fl{float: left;}
  .fr{float: right;}

  .gs_top_icon{display: flex;align-items: center;}
  .gs_top_icon p{margin: 0;}

  .ged_tabs .v-tabs-bar{height: 40px;font-size: 12px;}

</style>
