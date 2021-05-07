<template>
  <v-layout class="pa-4" column>

    <div class="md_editor_tit">
      <v-text-field class="mr-5" v-model="artTitle" outlined="" label="Title" hide-details></v-text-field>
      <bbxVersionControl v-model="artVersion" class="mr-5" dense style="width: 14vw;min-width: 110px;" label="版本"></bbxVersionControl>
      <div v-if="!$vuetify.breakpoint.mdAndDown">
        <v-btn outlined color="primary" class="mde_tit_btn" @click="backToHome"><v-icon left>arrow_back</v-icon>back</v-btn>
        <v-btn outlined color="primary" :disabled="saveBtnDisable" class="mde_tit_btn ml-2" @click="saveMd"><v-icon left>save</v-icon>save</v-btn>
      </div>
      <div v-else class="d-flex align-center">
        <v-btn outlined icon color="primary" @click="backToHome"><v-icon>arrow_back</v-icon></v-btn>
        <v-btn outlined icon color="primary" @click="saveMd" :disabled="saveBtnDisable" class="ml-2"><v-icon>save</v-icon></v-btn>
      </div>
    </div>

    <mavon-editor :boxShadow="false" :class="{mavonEditor:true,full_md:fullMdEdit}" :style="`height: ${editHeight}px;`" ref="mde"
                  @save="saveMd" @imgAdd="uploadImg" v-model="artValue" :toolbars="toolbars"
                  :subfield="!$vuetify.breakpoint.mdAndDown" @fullScreen="fullScreen"/>

    <div class="full_md_btn" v-if="fullMdEdit">
      <v-btn outlined icon color="primary" @click="backToHome"><v-icon>arrow_back</v-icon></v-btn>
      <v-btn outlined icon color="primary" @click="saveMd" :disabled="saveBtnDisable" class="mt-2"><v-icon>save</v-icon></v-btn>
    </div>

  </v-layout>
</template>

<script>
  import {
    url_post_update_content,
    url_get_content,
    url_post_upload,
  } from '../../util/api'
  import {img_base_url} from "@/util/const";
  import { mapMutations,mapState } from 'vuex'
  import { isEmpty , cloneDeep } from 'lodash'
  import bbxVersionControl from '../../components/bbxVersionControl'

  const axios = require('axios');

  export default {
    components: {
      bbxVersionControl,
    },
    data:()=>{
      return{
        editHeight:'',

        artTitle: '',   // 文章标题
        artTitleChanged: false,   // 文章标题是否变化
        artTitleCache: '',   // 从后台拿到的文章标题（编辑的时候有值）

        artValue: '',   // 文章内容
        artValueChanged: false,   // 文章内容是否变化
        artValueCache: '',   // 从后台拿到的文章内容（编辑的时候有值）

        artVersion: [],   // 文章内容
        artVersionChanged: false,   // 文章内容是否变化
        artVersionCache: [],   // 从后台拿到的文章内容（编辑的时候有值）

        categoryId: '',
        saveBtnDisable: true,

        // 编辑器的按钮栏
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          // trash: true, // 清空
          // save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },

        fullMdEdit:false,
      }
    },
    watch: {
      artValue(n) {
        // console.log('内容变化了',n , this.artTitle)
        this.artValueChanged = this.artValueCache == n;
        this.saveBtnDisable = this.$route.params.mdId ? this.artValueChanged && this.artTitleChanged && !!this.artVersionChanged : !(n && this.artTitle);

        this.$store.commit('updateArticleSaved',this.saveBtnDisable);   /** 告诉别人我是不是已经保存了 **/
      },
      artTitle(n) {
        // console.log('标题变化了',n,this.artTitleCache)
        this.artTitleChanged = this.artTitleCache == n;
        this.saveBtnDisable = this.$route.params.mdId ? this.artValueChanged && this.artTitleChanged && !!this.artVersionChanged : !(n && this.artValue);

        this.$store.commit('updateArticleSaved',this.saveBtnDisable);   /** 告诉别人我是不是已经保存了 **/
      },
      artVersion(n,ov) {
        if(n.join(',')==ov.join(',')) return;   /** 如果值相等则不去进行以下操作 **/
        this.artVersionChanged = this.artVersionCache.join(',') == n.join(',');
        this.saveBtnDisable = this.$route.params.mdId ? this.artValueChanged && this.artTitleChanged && !!this.artVersionChanged : !(n && this.artVersion);

        this.$store.commit('updateArticleSaved',this.saveBtnDisable);   /** 告诉别人我是不是已经保存了 **/
      },

      $route(to) {
        /** 5738-7 **/
        $('.mavonEditor').removeClass('fullscreen').removeClass('full_md');
        this.init();
      }
    },
    computed:{
      ...mapState({
        roleId: state=>state.roleId,
      }),
    },
    mounted() {

      /** todo 在这里去判断权限 1/2/3  具体移步 store.js roleId 字段 **/
      if(Number(this.roleId) === 3){
        this.$router.replace('/403');
        return;
      }

      this.categoryId = this.$route.query.categoryId;
      // console.log(this.categoryId)

      this.init();
      this.editResize();
    },
    methods:{

      ...mapMutations(['updateSideMenu']),

      /* 编辑 ---- 初始化文章 */
      async init(){
        if(this.$route.params.mdId){
          let fetchData = await this.$fetch(url_get_content,{id:this.$route.params.mdId});
          if (!fetchData.status){

            if(isEmpty(fetchData.data)){
              this.$notify({ type: 'error', title: '文章不存在', text:''});
              setTimeout(()=>{this.$router.replace('/');},500)
              return ;
            }

            this.artTitle = fetchData.data[0].title;
            this.artValue = fetchData.data[0].content;
            this.artVersion = cloneDeep(fetchData.data[0].content_version);
            this.artVersionCache = cloneDeep(fetchData.data[0].content_version);
            this.artValueCache = fetchData.data[0].content;
            this.artTitleCache = fetchData.data[0].title;
            this.saveBtnDisable = true;

            if(fetchData.data[0].edit_permission==0){
              this.$router.replace('/403');
            }

          }
        }else{
          this.artTitle = '';
          this.artValue = '';
          this.artVersion = [];
        }
      },
      /* 重置编辑器高度 */
      editResize(){
        this.editHeight = document.documentElement.clientHeight - 147 - 64;
        window.onresize = ()=>{
          return  this.editHeight = document.documentElement.clientHeight - 147 - 64;
        };
      },

      /* 保存文章 */
      async saveMd(){
        let params = {
          category_id:this.categoryId,
          title:this.artTitle,
          content:this.artValue,
          version_id:this.artVersion || []
        };

        this.$route.params.mdId ? params.id = this.$route.params.mdId : '';

        if(!this.artTitle){
          this.$notify({ type: 'error', title: '请输入文章标题', text:''});
        }else if(!this.artValue){
          this.$notify({ type: 'error', title: '请输入文章内容',/*duration:3000000*/});
        }else if(!this.artVersion.length){
          this.$notify({ type: 'error', title: '请至少选择一个目标版本'});
        }else {

          // 保存文章
          let fetchData = await this.$fetch(url_post_update_content,params,'post');
          if(!fetchData.status){
            this.updateSideMenu();
            setTimeout(()=>{ this.$notify({ type: 'success', title: '保存成功',/*duration:3000000*/}); },500);
            if(this.$route.params.mdId){ this.init(); }else{
              this.$router.push({
                path:'/MdEdit/'+fetchData.data.id,
                query:{...this.$route.query}
              })
            }
          }else{
            setTimeout(()=>{ this.$notify({ type: 'error', title: fetchData.message,}); },500)
          }

        }

        this.$store.commit('updateArticleSaved',true);   /** 告诉别人我是不是已经保存了 **/
      },

      /* 上传图片回调 */
      async uploadImg(pos, $file){
        let Authorization = localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '';

        let formdata = new FormData();
        formdata.append('file', $file);
        let fetchImg = await axios({
          url: url_post_upload,
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data','token':Authorization },
        });
        fetchImg = fetchImg.data;
        if(!fetchImg.status){

          let url = img_base_url + fetchImg.data.src;
          console.log(url)
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          /**
           * $vm 指为mavonEditor实例，可以通过如下两种方式获取
           * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
           * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
           */
          this.$refs.mde.$img2Url(pos, url);
        }
        // let fetchData = await this.$fetch(url_post_upload,file,'post');
      },

      /* 返回首页 */
      backToHome(){
        console.log(this.saveBtnDisable,this.$route)
        let params = {
          categoryId:this.$route.query.categoryId,
          articleId:this.$route.params.mdId,
        };

        if(!this.saveBtnDisable){
          this.$confirm('编辑尚未保存，确定返回吗?','提示').then(async() => {
            this.$router.push({path:'/',query:params})
          })
        }else{
          this.$router.push({path:'/',query:params})
        }
      },

      /** 全屏显示 **/
      fullScreen(fullMd,mdValue){
        // console.log(fullMd,mdValue);
        this.fullMdEdit = fullMd;
        this.$store.commit('updateFullMdEdit',fullMd);   /** 告诉别人我是不是全屏编辑 **/
      },

    }

  };
</script>

<style scoped>

  .md_editor_tit{height: 60px;overflow: hidden;padding-top: 4px;display: flex;align-items: center;}
  .md_editor_tit .mde_tit_btn{width: 110px;}

  .mavonEditor { width: 100%;min-height: 400px; }
  .mavonEditor.full_md{ position: fixed;top: 0;left: 0;z-index: 100;width: 100vw;height: 100vh!important;}

  .full_md_btn{position: fixed;bottom: 3.5vh;right:15px;z-index: 10200;display: flex;flex-direction: column;align-items: center;}

</style>
