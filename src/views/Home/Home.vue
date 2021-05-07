<template>
  <div style="padding-bottom: 80px;" ref="myHome" :class="{'w-100':!$vuetify.breakpoint.xs}">
    <v-layout class="md_content pa-3 mx-auto" justify-center >

      <!--  右侧导航 => 左侧导航 -->
      <v-flex v-if="!($vuetify.breakpoint.mdAndDown)" class="" style="position: relative;width: 20%;min-width: 240px;">
        <div style="position: fixed; width: calc(20% - 60px);min-width: 220px;">
          <v-card mb-5 theme--light class="pa-5" style="max-height: 50vh;overflow-y: auto; width: 100%;">
            <div class="overline pb-2 primary--text">Table of contents</div>
            <div class="pl-3" id="wiki_nav"></div>
          </v-card>

          <v-layout class="mt-5 no-print py-1" style="background-color: #eee;justify-content: center;">
            <v-btn icon title="Print" color="grey" class="mr-5" @click="printArt">
              <v-icon style="font-size: 20px">print</v-icon>
            </v-btn>
            <v-btn v-if="Number(roleId)==1" icon title="PDF" color="grey" class="mr-5" @click="">
<!--              <v-icon style="font-size: 20px" @click="exportPDF('v-show-content',articleTitle)">picture_as_pdf</v-icon>-->
              <v-icon style="font-size: 20px" @click="">picture_as_pdf</v-icon>
            </v-btn>
<!--            <v-btn icon title="Bookmark" color="grey">-->
<!--              <v-icon style="font-size: 20px" @click="addBrowserFov">bookmark</v-icon>-->
<!--            </v-btn>-->
          </v-layout>
        </div>
      </v-flex>

      <!--  中间文章  -->
      <v-flex ref="print" style="width: 75%">
        <mavon-editor class="md" :value="context" :subfield = "subfield" :defaultOpen = "defaultOpen"
                      :toolbarsFlag = "toolbarsFlag" :editable="editable" :scrollStyle="scrollStyle"
                      :navigation="true" :boxShadow="false"
        />
      </v-flex>

    </v-layout>

    <!--  下方紧贴footer的文章分页  -->
    <v-container v-if="articleList.length>1" style="z-index: 100;position: absolute;bottom: 0;width: calc(100% - 20px);padding-bottom: 5px;">
      <v-layout style="height: 80px;" justify-space-between align-center>

        <!--    Previous    -->
        <v-layout style="width: 50%" v-if="curArticleIndex-1>=0">
          <div class="overflow-hidden home_footer" @click="switchArticle(articleList[curArticleIndex-1])">
            <v-icon class="mr-4">arrow_back</v-icon>
            <div class="subtitle-1">{{articleList[curArticleIndex-1].title}}</div>
          </div>
        </v-layout>

        <!--    Next    -->
        <v-layout style="width: 50%;" justify-end  v-if="curArticleIndex+1<articleList.length">
          <div class="overflow-hidden home_footer" @click="switchArticle(articleList[curArticleIndex+1])">
            <div class="subtitle-1 text-right">{{articleList[curArticleIndex+1].title}}</div>
            <v-icon class="ml-4">arrow_forward</v-icon>
          </div>
        </v-layout>
      </v-layout>
    </v-container>

  </div>

</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import {
    url_get_content_list,
    url_get_main_menu,
    url_get_content,
    url_post_update_content,
  } from '../../util/api'
  import bbAlert from '@/components/bbAlert.vue'


  import Router from 'vue-router'

  /* 去掉点击相同路径的警告 */
  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) { return originalPush.call(this, location).catch(err => err) };

  export default {
    components: {
      bbAlert
    },
    data:()=>{
      return{

        /* 有关markdown的设置 */
        articleTitle: '',
        context: '',
        subfield: false,// 单双栏模式
        defaultOpen: 'preview',//edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,

        /* 左边的数据( 文章 ) */
        articleList:[
          // {title:'Admonition', id:1, },
          // {title:'CodeHilite', id:2, },
          // {title:'Footnotes', id:3, },
          // {title:'Metadata', id:4, },
          // {title:'Permalinks', id:5, },
          // {title:'PyMdown', id:6, },
        ],
        curArticleId:0,
        curArticleIndex:0,    // 当前文章所属数组下标

        // 当前的二级分类ID
        categoryId:0,
        menuData:[],

      }
    },
    watch:{
      async '$route'(to,fromR){
        // 显示导航的内容
        await this.initData(to);
        // console.log(to,fromR,to==fromR,1111111111111)
        setTimeout(()=>{ this.navMoveTo(); this.tapFootnote(); },400);
        /** 为避免一直有 loading  **/
        setTimeout(()=>{ this.$store.commit('modShowSkeletonLoader',{show:false}); },8000);
      },
    },
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin,
        roleId: state=>state.roleId,
      }),
    },
    async mounted() {

      // 初始化菜单数据
      await this.initData(this.$route);

      // 显示导航的内容
      $('#wiki_nav').html($('.v-note-navigation-wrapper .v-note-navigation-content'));
      // 页面滚动时导航智能定位
      setTimeout(()=>{ this.navMoveTo(); this.tapFootnote(); },400);
    },
    methods:{

      ...mapActions(['fetchMenu']),

      // 初始化菜单数据
      async initMenu(){
        let fetchData = await this.$fetch(url_get_main_menu);
        if(fetchData.data.length){
          this.menuData = fetchData.data;
        }
      },
      // 初始化数据
      async initData(path){
        await this.initMenu();
        path = path || this.$route;
        if(this.menuData.length){
          this.categoryId = path.query.categoryId || this.menuData[0].child[0].id;

        }

        let version = JSON.parse(sessionStorage.getItem('version'));
        let version_id = version && version.categoryId == this.categoryId ? version.id : undefined;
        /* 获取文章列表 */
        let params = {category_id:this.categoryId,version_id:version_id || undefined};
        if(version_id===undefined) delete params.version_id;
        let fetchArticleList = await this.$fetch(url_get_content_list,params,'get');
        if(!fetchArticleList.status){
          this.articleList = fetchArticleList.data;
        }

        this.articleList.forEach((res,idx) => {
          if(path.query.articleId)
            if( res.id==path.query.articleId)
              this.curArticleIndex = idx;
        })

        let curArticle = path.query.articleId ? this.articleList.find(res => res.id==path.query.articleId) || this.articleList[0] : this.articleList[0];

        /* 获取文章详情 */
        // !this.articleList.length || this.switchArticle(curArticle);
        this.switchArticle(curArticle);

        console.log('初始化数据',curArticle)
      },


      // 页面滚动时导航智能定位
      navMoveTo(){
        /** 初始化 页面滚动到最顶上 **/
        $('html,body').animate({scrollTop:0}, 300);

        // 给对应的 h1-h6 加上相应的点击事件 并移动到相应的位置
        for(let i=1;i<=6;i++){
          $('.v-show-content h'+i).each(function () {
            $(this).addClass('section');
            let val = $(this).find('a').attr('id');
            if(/^\d/.test(val)){ $(this).find('a').attr('id','number'+val) }
          });
          $('.v-note-navigation-content h'+i).each(function () {
            $(this).addClass('nav');
            let val = $(this).find('a').attr('id');
            if(/^\d/.test(val)){ $(this).find('a').attr('id','number'+val) }
          });
        }

        $('.md_content').unbind().on('click','#wiki_nav .nav',function () {
          let val = $(this).find('a').attr('id');
          // console.log($('.v-show-content '+'#'+val),'.v-show-content '+'#'+val,val.substr(0,1))
          $('html,body').animate({scrollTop:$('.v-show-content '+'a#'+val).offset().top - 80}, 400);
        });

        let $navs = $('.nav'),                     // 导航
            $sections = $('.section'),             // 模块
            $window = $(window), navLength = $navs.length - 1;
        $($navs[0]).addClass('cur');  //  初始化 给第一个导航加上 颜色
        /** 监听滚动事件 **/
        $window.unbind().on('scroll', function() {
          let scrollTop = $window.scrollTop(), len = navLength;
          for (; len > -1; len--) {
            let that = $sections.eq(len);
            if (that.offset() && scrollTop >= that.offset().top-90) {
              $navs.removeClass('cur').eq(len).addClass('cur');
              break;
            }
          }
        });
      },

      /** 脚注功能点击脚注跳转到当前页面指定的区域 **/
      tapFootnote(){
        let _this = this;
        $('.md_content .footnote-backref').each(function () {
          $(this).attr('hlink',$(this).attr('href')).attr('href','javascript:;');
        });
        $('.md_content .footnote-ref a').each(function () {
          $(this).attr('hlink',$(this).attr('href')).attr('href','javascript:;');
        });
        $('body').on('click','.footnote-backref',function () {
          let href = $(this).attr('hlink');
          // $('html').animate({scrollTop:$('.v-show-content '+href).offset().top - 50}, 400);
          _this.$vuetify.goTo($('.v-show-content '+href).offset().top - 50,{ duration: 1000, offset: 0, easing: 'easeInOutCubic' })
        }).on('click','.footnote-ref a',function () {
          let href = $(this).attr('hlink');
          // $('html').animate({scrollTop:$('.v-show-content '+href).offset().top - 50}, 400);
          _this.$vuetify.goTo($('.v-show-content '+href).offset().top - 50,{ duration: 1000, offset: 0, easing: 'easeInOutCubic' })
        });
      },

      // 点击切换文章 获取文章详情
      async switchArticle(cur){
        if(cur===undefined) { this.context = ''; return ; }
        this.$route.query.articleId ? this.$store.commit('modShowSkeletonLoader',{show:true,type:'home'}) : '';
        this.curArticleId = cur.id;

        let path = this.$route.path;
        let query = this.$route.query;
        let newQuery = JSON.parse(JSON.stringify(query));
        console.log('点击切换文章',newQuery)
        newQuery.articleId = cur.id;
        this.$router.push({ path, query: newQuery });
        let fetchArticleData = await this.$fetch(url_get_content,{id:cur.id},'get');
        setTimeout(()=>{this.$store.commit('modShowSkeletonLoader',{show:false});},200)
        if(!fetchArticleData.status){
          this.context = fetchArticleData.data[0].content;
          this.articleTitle = fetchArticleData.data[0].title;
        }
        this.freezeCopy();
      },

      /** 冻结 禁用复制 **/
      freezeCopy(){
        if(this.$store.state.roleId==3) $('.md_content')[0].onselectstart = function () { return false; };
      },

      // 打印文章
      printArt(){
        // this.$print(this.$refs.print)
        this.$print($('.md .v-note-read-content')[0])
      },

      // 添加到浏览器网页收藏夹
      addBrowserFov(){
        let url = window.location;
        let title = document.title;
        let ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("msie 8") > -1) {
          external.AddToFavoritesBar(url, title, '');//IE8
        } else {
          try {
            window.external.addFavorite(url, title);
          } catch (e) {
            try {
              window.sidebar.addPanel(title, url, "");//firefox
            } catch (e) {
              alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
          }
        }
      },

      /** 导出 pdf **/
      /*exportPDF(){
        // html2canvas(
        //   $('.v-show-content')[0],
        //   {
        //     dpi: 192,//导出pdf清晰度
        //     allowTaint: false,
        //     useCORS: true,
        //     onrendered: function (canvas) {
        //       let contentWidth = canvas.width;
        //       let contentHeight = canvas.height;
        //
        //       //一页pdf显示html页面生成的canvas高度;
        //       let pageHeight = contentWidth / 592.28 * 841.89;
        //       //未生成pdf的html页面高度
        //       let leftHeight = contentHeight;
        //       //pdf页面偏移
        //       let position = 0;
        //       //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
        //       let imgWidth = 595.28;
        //       let imgHeight = 592.28 / contentWidth * contentHeight;
        //
        //       let pageData = canvas.toDataURL('image/jpeg', 1.0);
        //       let pdf = new jsPDF('', 'pt', 'a4');
        //
        //       //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //       //当内容未超过pdf一页显示的范围，无需分页
        //       if (leftHeight < pageHeight) {
        //         pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        //       } else {
        //         while (leftHeight > 0) {
        //           pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        //           leftHeight -= pageHeight;
        //           position -= 841.89;
        //           //避免添加空白页
        //           if (leftHeight > 0) {
        //             pdf.addPage();
        //           }
        //         }
        //       }
        //       pdf.save('content.pdf');
        //     },
        //     //背景设为白色（默认为黑色）
        //     // background: "#fff"
        //   })
        // console.log($('.v-show-content')[0])

      },*/

    }

  };
</script>

<style lang="less">

  .w-100{width: 100%;}

  .fix-w1200{width: 1200px;margin: 0 auto;}
  .f_text_overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    width: 75%;
  }

  @link_color:        #428bca; // sea blue

  .md_content{height: 100%;position: relative;z-index: 10;}
  .md_content .md { width: 100%;}
  .md_content .v-note-wrapper {overflow: initial;}
  .md_content .v-note-wrapper .single-show {}
  .md_content .v-note-wrapper .v-note-panel {overflow: initial;border: 0}

  /* 左侧文章 List 样式 */
  .md_content .art_list{font-size: 14px;}
  .md_content .art_list .art_li{margin-top: 4px;}
  .md_content .art_list .art_li .tit{cursor: pointer}
  .md_content .art_list .art_li:hover{ color: @link_color; }
  .md_content .art_list .art_li.cur{ color: @link_color; }

  .md_content .art_list .art_li .opr_bar{ display: none; }
  .md_content .art_list .art_li .opr_bar .v-icon{ font-size: 20px;cursor: pointer; }
  .md_content .art_list .art_li:hover .opr_bar{ display: block; }


  /* 右侧导航的样式 */
  .md_content .v-note-wrapper .v-note-panel .v-note-navigation-wrapper{display: none;}
  .md_content #wiki_nav .cur{ color: @link_color; }
  .md_content #wiki_nav a.cur{ color: @link_color; }

  /* 循环定义右侧导航的样式 h1-h6 */
  .generate-columns(6);
  .generate-columns(@n, @i: 1) when (@i =< @n) {

    .md_content #wiki_nav h@{i}{
      cursor: pointer;font-size: 14px;font-weight: normal;color: #333;margin-top: 4px;
      margin-left: (10px * @i - 10px);
    }
    .md_content #wiki_nav h@{i}:hover{ color: @link_color; }

    .generate-columns(@n, (@i + 1));
  }

  /* 最下方切换文章 */
  .home_footer{display: flex;cursor: pointer;transition: .4s ease}
  .home_footer:hover{opacity: .7}

</style>
