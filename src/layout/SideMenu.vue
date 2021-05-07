<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-navigation-drawer v-model="drawer" color="indigo" dark app clipped mobile-break-point='600'
                         :temporary='$vuetify.breakpoint.mdAndDown' :right='$vuetify.rtl'
                         :mini-variant="sideBarMini">
      <div style="height: 100%;" @mouseenter="toggleMini(false,$event)" @mouseleave="toggleMini(true,$event)">
        <v-list dense>

          <!--    该 Menu 下的标题    -->
          <SideMenuTitle :curCategory="curCategory" :sideBarMini="sideBarMini" :categoryId="categoryId"
                         @toggleSideBig="toggleSideBig" @changeVersion="changeVersion" @addNewArticle="addNewArticle"></SideMenuTitle>

          <v-divider></v-divider>

          <!--    文章目录    -->
          <v-list-item-group v-model="curArticleIndex" :ripple="false">

            <draggable :sort="Number(roleId)!==3" data-name="right" v-model="articleList" :options="{group:{name:'menu', put: false}}" @change="dragChange">
              <v-list-item class="article_item pl-4" v-for="(i,key) in articleList" @click="switchArticle(i)" :key="key" :title="i.title">
                <v-list-item-content>
                  <v-list-item-title v-if="!sideBarMini">{{i.title}}</v-list-item-title>
                  <v-list-item-title class="font-weight-black text-center" v-else>{{i.title.slice(0, 1)}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action :class="{article_hover:!$vuetify.breakpoint.mdAndDown, 'side_menu_li':true}" v-if="isLogin && Number(roleId)!=3">
                  <v-btn dark icon @click.stop="showToolsFloat(i,key,$event)"> <v-icon>more_vert</v-icon> </v-btn>
                </v-list-item-action>
              </v-list-item>
            </draggable>

          </v-list-item-group>

        </v-list>
      </div>

    </v-navigation-drawer>

    <!--  文章的菜单  -->
    <v-card class="tools_float" v-tapOutside="handleClose" v-show="showTools" :style="{top:toolsProp.y+'px',left:toolsProp.x+'px'}">
      <v-btn @click="deleteArticle(nowArticle.item.id)" tile><v-icon title="Delete">close</v-icon></v-btn>
      <v-btn v-if="nowArticle.item.edit_permission" @click="editArticle(nowArticle.item,nowArticle.idx)" tile><v-icon title="Edit">edit</v-icon></v-btn>
      <v-btn v-if="Number(roleId)==1" @click="showHistory()" tile class="history_btn"><v-icon title="History">history</v-icon></v-btn>
      <v-btn v-if="Number(roleId)==1" @click="versionFloat=true" tile><v-icon title="Version control">file_copy</v-icon></v-btn>
    </v-card>
    <bbHistory :menuShow="showHistoryFloat" v-tapOutside="handleCloseHistory" :timeAxisData="historyList"
               :x="$vuetify.breakpoint.mdAndDown ? '5vw' : toolsProp.x" :y="$vuetify.breakpoint.mdAndDown?'15vh':toolsProp.y"
               :pp-style="{height:popMenuH+'px',width:$vuetify.breakpoint.mdAndDown ? `90vw` : ``}"></bbHistory>

    <!--  版本复制弹窗  -->
    <bbxDialogs title="版本控制" :dialogName="versionFloat" @confirm="vControlConfirm" @cancel="versionFloat=false">
      <template v-slot:body="">
        <bbxVersionControl v-model="nowArticle.item.version"></bbxVersionControl>
      </template>
    </bbxDialogs>

    <!--  点击向上滑动  -->
    <v-fab-transition>
      <v-btn v-if='upBtnShown'
             fab fixed bottom small depressed dark color='primary'
             @click='$vuetify.goTo(0, scrollOpts)'
             :style='$vuetify.rtl ? `right: 235px;` : `right: 15px;bottom: 34px;`'>
        <v-icon>arrow_upward</v-icon>
      </v-btn>
    </v-fab-transition>

    <!--  点击显示侧边栏  -->
    <v-fab-transition>
      <v-btn fab color='primary' fixed bottom small :right='$vuetify.rtl' :left='!$vuetify.rtl'
             @click='drawer = !drawer' v-if='$vuetify.breakpoint.mdAndDown' v-show='!drawer' class="elevation-0"
             style="bottom: 34px;">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-fab-transition>

  </div>
</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import { cloneDeep,find, debounce } from 'lodash'
  import draggable from 'vuedraggable'
  import bbHistory from '../components/bbHistory'
  import SideMenuTitle from './SideMenuTitle'
  import SideMenuVersionCopy from './SideMenuVersionCopy'
  import bbxDialogs from '@/components/bbxDialogs.vue'
  import bbxVersionControl from '@/components/bbxVersionControl'

  import {
    url_get_content_list,
    url_get_main_menu,
    url_sequence_menu,
    url_get_content,
    url_post_update_content,
    url_artcle_log,
    url_copycontent,
  } from '../util/api'

  export default {
    components:{
      draggable,
      bbHistory,
      SideMenuTitle,
      SideMenuVersionCopy,
      bbxDialogs,
      bbxVersionControl,
    },
    props: {

    },
    data: () => ({
      drawer: null,
      scrollOpts: {
        duration: 1500,
        offset: 0,
        easing: 'easeInOutCubic'
      },
      upBtnShown: false,

      //  文章相关
      articleList:[],
      curArticleId:0,
      curArticleIndex:0,    // 当前文章所属数组下标
      nowArticle:{item:{},idx:0},    /** 当前文章的属性 **/
      showTools:false,
      toolsProp:{x:-100,y:-100},

      /** 历史记录相关 **/
      showHistoryFloat:false,
      historyList:[],

      // Menu 相关
      menuData:[],
      curCategory:{},
      categoryId:0,

      // 侧边栏迷你变小
      sideBarMini: false,
      sideBarBig: false,

      /** 关于版本 **/
      versionArr:[],
      curVersion:{version:''},
      versionFloat:false,

    }),
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin,
        sideMenuNumber: state=>state.sideMenuNumber,
        ifArticleSaved: state=>state.ifArticleSaved,
        roleId: state=>state.roleId,
      }),
      popMenuH(){
        return this.historyList.length > 2 ? 350 : 160*this.historyList.length;
      }
    },
    watch:{
      sideMenuNumber(){
        this.initArticleList();
      },
      $route(to){
        this.initArticleList(to);
      },
      sideBarMini(nv){
        if(nv) {
          this.showTools = false;
          this.showHistoryFloat = false;
        }
      }
    },
    created(){
      /** 创建一个防抖函数 ------ 防止多次点击一直闪烁 #6855-7 **/
      this.debounce = debounce(this.dd,800,{
        leading:false,
        maxWait:2*1000,
        trailing:true,
      })
    },
    async mounted() {
      window.addEventListener('scroll', this.upBtnScroll);
      await this.initArticleList();
    },
    methods:{

      toggleSideBig(){
        this.sideBarBig=!this.sideBarBig;
        setTimeout(()=>{ this.sideBarMini = false },0);
      },
      toggleMini(value,e){
        // console.log('toggleMini', $(e.toElement).hasClass('v-btn'))
        if(this.sideBarBig){
          /** 一进一出 的时候 判断 如果是点击的时候不应该关闭 **/
          this.sideBarMini = value;
        }
      },

      // 初始化菜单数据
      async initMenu(){
        let fetchData = await this.$fetch(url_get_main_menu);
        if(fetchData.data.length){
          this.menuData = fetchData.data;
        }
      },

      // 初始化文章列表
      async initArticleList(path){
        await this.initMenu();
        path = path || this.$route;
        if(this.menuData.length){
          this.categoryId = path.query.categoryId || this.menuData[0].child[0].id;

          //  方便该 Menu 下的标题 文章所属菜单 显示
          this.menuData.forEach(res=>{
            res.child.forEach(cres=>{
              if(cres.id == this.categoryId){
                this.curCategory = cres;
              }
            })
          });
        }

        let version = JSON.parse(sessionStorage.getItem('version'));
        let version_id = version && version.categoryId == this.categoryId ? version.id : undefined;
        // this.$store.commit('modShowPageLoading',true);
        /* 获取文章列表 */
        let params = {category_id:this.categoryId,version_id:version_id || undefined};
        if(version_id===undefined) delete params.version_id;
        let fetchArticleList = await this.$fetch(url_get_content_list,params,'get');
        if(!fetchArticleList.status){
          this.articleList = fetchArticleList.data;
        }
        let articleId = path.name === 'MdEdit' ? path.params.mdId : path.query.articleId;
        this.updateCurArticleIndex(articleId);

        // this.$store.commit('modShowPageLoading',false);
      },

      updateCurArticleIndex(articleId){
        this.curArticleId = articleId;
        if(articleId) this.curArticleIndex = this.articleList.findIndex(i=>i.id==articleId);
        // console.log('updateCurArticleIndex',this.curArticleId,this.curArticleIndex)
      },

      /** 点击显示文章操作悬浮窗 **/
      showToolsFloat(i,key,e){

        this.nowArticle.idx = key;
        this.nowArticle.item = i;

        setTimeout(()=>{
          let toolsH = $('.tools_float').height();
          // console.log(i,key,e,toolsH);
          let yAxis = e.y+toolsH > this.$vuetify.breakpoint.height ? this.$vuetify.breakpoint.height - toolsH - 10 : e.y;
          this.toolsProp = { x:e.x, y:yAxis, };
        },0);

        this.showTools = true;
        this.sideBarMini = false;         // 侧边栏不收起
        this.showHistoryFloat = false;    // 关闭历史记录弹窗
      },
      /** 点击其他区域隐藏 **/
      handleClose(e){
        if (!$('.side_menu_li')[this.nowArticle.idx].contains(e.target)) { this.showTools = false; if(this.sideBarBig)this.sideBarMini = true; }
      },
      handleCloseHistory(e){
        if (!$('.history_btn')[0].contains(e.target)) { this.showHistoryFloat = false; }
      },
      async showHistory(){
        let fetchHistory = await this.$fetch(url_artcle_log,{content_id:this.nowArticle.item.id},'get');
        if(fetchHistory.status){ return; }
        if(!fetchHistory.data.length) {
          this.$notify({type:'error',title:'error',text:'暂无历史纪录'});
          /** #5965 收起侧边栏 **/
          if(this.sideBarBig)this.sideBarMini = true;
        }else{
          /** #5965 收起侧边栏 **/
          if(this.sideBarBig)this.sideBarMini = false;
          fetchHistory.data.forEach(i=>{
            switch (true) {
              case i.op=='add' : i.color='#08e24b'; break;
              case i.op=='edit' : i.color='#2c77ff'; break;
              case i.op=='delete' : i.color='#ff3e2f'; break;
              default:break;
            }
          });
        }
        this.showTools = false;
        this.showHistoryFloat = true;
        this.historyList = fetchHistory.data;
      },

      // 点击切换文章 跳轉
      async switchArticle(cur){
        this.cur = cur;
        this.debounce()
      },
      dd(){
        let cur = this.cur;
        this.curArticleIndex = this.articleList.findIndex(i=>i.id==cur.id);
        if(cur.id!=this.curArticleId){
          // this.$store.commit('modShowPageLoading',true);
          this.curArticleId = cur.id;
          let path = this.$route.path;
          let query = this.$route.query;
          let newQuery = JSON.parse(JSON.stringify(query));
          newQuery.articleId = cur.id;
          this.$router.push({ path:'/', query: newQuery });
        }
        setTimeout(()=>{this.sideBarMini = false;},0);
      },

      // 删除文章
      async deleteArticle(deId){
        /** #5965 收起侧边栏 **/
        if(this.sideBarBig)this.sideBarMini = false;
        if(this.roleId==3){
          this.$notify({ type: 'error', title: '删除失败', text:'本权限不能进行删除'});
          return;
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          let version = JSON.parse(sessionStorage.getItem('version'));
          let fetchArticleData = await this.$fetch(url_post_update_content,{delete_id:deId,version_id:[]},'post');
          if(!fetchArticleData.status){
            this.$notify({ type: 'success', title: '删除成功', text:''});
            await this.initArticleList();
            if(this.curArticleId==deId){
              this.switchArticle(this.articleList[0])
            }
            if(this.$route.name=='MdEdit' && this.$route.params.mdId==deId){
              /** 说明删除的是当前页面 并且是编辑页面 **/
              this.$router.push(`/mdEdit/?categoryId=`+this.categoryId)
            }
          }
        }).catch(()=>{
          console.log('取消',this.curArticleIndex);
        })
      },

      // 编辑文章
      async editArticle(i,key){
        /** #5965 收起侧边栏 **/
        if(this.sideBarBig)this.sideBarMini = false;
        if(this.roleId==3){
          this.$notify({ type: 'error', title: '编辑失败', text:'本权限不能进行编辑'});
          return;
        }
        // this.articleSaved(()=>{
          this.curArticleIndex = key;
          this.showTools = false;
          this.$router.push('/mdEdit/'+i.id + `?categoryId=`+this.categoryId)
        // });
      },

      // 新增文章
      async addNewArticle(){
        if(this.roleId==3){
          this.$notify({ type: 'error', title: '新增失败', text:'本权限不能进行新增'});
          return;
        }
        this.articleSaved(()=>{
          this.$router.push(`/MdEdit?categoryId=`+this.categoryId)
        });
      },

      // 判断数据是否已经保存,并且接受已经保存回调
      articleSaved(fn){
        // console.log(this.ifArticleSaved);
        if(!this.ifArticleSaved){
          /** 首先判断用户有没有保存数据 **/
          this.$confirm('请先保存本页面的数据?', '提示', { confirmButtonText: '确定', showCancelButton:false }).then(async() => {
            // this.$router.push(`/MdEdit?categoryId=`+this.categoryId)
          }).catch(()=>{});
        }else{
          fn && fn();
        }
      },

      // 滚动事件
      upBtnScroll () {
        const scrollOffset = window.pageYOffset || document.documentElement.scrollTop
        this.upBtnShown = scrollOffset > window.innerHeight * 0.33
      },

      // 文章列表 拖动排序  url_sequence_menu
      async dragChange(evt){
        if(this.roleId==3){
          this.$notify({ type: 'error', title: '排序失败', text:'本权限不能进行排序'});
          return;
        }
        console.log(evt)
        let params = [];
        this.articleList.forEach(item=>{ params.push(item.id); });
        let version = JSON.parse(sessionStorage.getItem('version'));
        let nArticleList = await this.$fetch(url_sequence_menu,{id_list:params,version_id:version.id},'post');
        if(nArticleList.status)return;
        this.$notify({ type: 'success', title: '排序成功', text:''});
        this.updateCurArticleIndex(this.curArticleId);
      },

      /** 关于版本 **/
      async changeVersion(){
        this.initArticleList()
      },
      /** 切换文章版本 **/
      async vControlConfirm(){
        let {id,version} = this.nowArticle.item
        let params = { id, category_id: this.categoryId, version_id:version };
        let postData = await this.$fetch(url_copycontent,params,'post');
        if(postData.status){
          this.$notify({ type: 'error', title: postData.message,});
          return ;
        }
        this.$notify({ type: 'success', title: '保存成功'});
        this.initArticleList();
        this.versionFloat = false;
      },

    },
    destroyed(){
      window.removeEventListener('scroll', this.upBtnScroll);
    },
  }
</script>


<style lang="less">
  .white_expand{white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}

  .side_menu_li{margin: 0;display: inline;}
  .article_item .v-icon{font-size: 20px;line-height: 40px;}
  .article_hover{display: none;}
  .article_item:hover .article_hover{display: block;}

  .tools_float{position: fixed;z-index: 100;padding: 0;display: flex;align-items: center;flex-direction: column;}
</style>
