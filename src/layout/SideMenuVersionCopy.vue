<template>
  <div v-if="false">
    <div style="width: 100%;display: flex;justify-content: center;" v-if="Number(roleId)!==3">
      <v-btn text small class="mt-3 mb-8 mx-auto" title="复制其他版本中的文章到该版本" @click="clickCopy">版本复制</v-btn>
    </div>

    <!--  版本复制弹窗  -->
    <bbxDialogs title="复制到当前版本" :dialogName="showCopyDia" @confirm="copyDiaConfirm" @cancel="copyDiaCancel">
      <template v-slot:body="">
        <v-autocomplete v-model="checkedArticle" :items="articleList" label="请选择文章" item-text="title" item-value="id" dense multiple class="sm_vc_ipt"></v-autocomplete>
      </template>
    </bbxDialogs>
  </div>
</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import { cloneDeep,find } from 'lodash'
  import bbxDialogs from '@/components/bbxDialogs.vue'

  import {
    url_copycontent,
    url_category_allcontent,
  } from '../util/api'

  export default {
    components:{
      bbxDialogs,
    },
    props: {
    },
    data: () => ({
      showCopyDia:false,
      articleList:[],
      checkedArticle:[],
    }),
    computed:{
      ...mapState({
        roleId: state=>state.roleId,
      }),
    },
    watch:{

    },
    async mounted() {

    },
    methods:{
      async clickCopy(){
        this.showCopyDia = true;
        let version = JSON.parse(sessionStorage.getItem('version'));
        let fetchCateList = await this.$fetch(url_category_allcontent,{category_id:version.categoryId,exclude_version_id:version.id},'get');
        if(fetchCateList.status){ return; }
        this.articleList = fetchCateList.data[1].content;
      },
      async copyDiaConfirm(){
        this.showCopyDia = false;
        let version = JSON.parse(sessionStorage.getItem('version'));
        let params = { id_list:this.checkedArticle, category_id:version.categoryId, version_id:version.id };
        let postData = await this.$fetch(url_copycontent,params,'post');
        if(postData.status){ return; }

        this.$emit('copyDiaConfirm');
      },
      copyDiaCancel(){
        this.showCopyDia = false;
      },
    },
  }
</script>


<style lang="less">
  .sm_vc_ipt{font-size: 13px!important;}
  .sm_vc_ipt .v-label{font-size: 13px!important;}
</style>
