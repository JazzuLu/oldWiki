<template>
<!--  <v-list three-line class="elevation-4 search_list my-6" v-infiniteScroll="loadMore" :infinite-scroll-disabled="busy">-->
  <v-list three-line class="elevation-4 search_list my-6">
    <template v-for="(item, index) in items">

      <v-divider v-if="index!==0"></v-divider>

      <v-list-item :key="item._source.id" @click="$router.push(`/?categoryId=${item._source.category_id}&articleId=${item._source.id}`)">
        <v-list-item-content>
          <v-list-item-title class="mb-2" style="font-weight: bold;">
            <span v-if="item.cate_1">{{item.cate_1.category_name}}-></span>
            <span v-if="item.cate_2">{{item.cate_2.category_name}}-></span>
            <span v-html="item._source.title"></span>
          </v-list-item-title>
          <v-list-item-subtitle class="mb-2" v-if="item.highlight && item.highlight.title" v-html="item.highlight.title[0]"></v-list-item-subtitle>
          <v-list-item-subtitle class="mb-2" v-if="item.highlight && item.highlight.content" v-for="ic in item.highlight.content" v-html="ic"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <div v-if="!items.length && fetchSuccess" style="margin: 10vh auto;text-align: center;color: #bbb;">
      <v-icon class="mb-3" style="font-size: 120px;color: #bbb">sentiment_very_dissatisfied</v-icon>
      <p class="title"> 空空如也~~ </p>
      <v-btn @click="$router.go(-1)" small color="primary" class="mt-2 mx-auto px-5" style="display: block;font-weight: bold;"> 返回 </v-btn>
    </div>
  </v-list>
</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import { isEmpty } from 'lodash'
  import {
    url_search_content,
  } from '../../util/api'

  import Router from 'vue-router'

  /* 去掉点击相同路径的警告 */
  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) { return originalPush.call(this, location).catch(err => err) };

  export default {
    components: {
    },
    data:()=>{
      return{
        items: [
          // {
          //   _source: {title: 'Brunch this weekend?',},
          //   highlight:{title:[ "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" ]},
          // },
        ],

        total:999999,
        pageNum:0,
        pageSize:3,
        busy:false,
        fetchSuccess:false,
      }
    },
    watch:{
      '$route':{
        async handler(to){
          this.items = [];
          this.pageNum = 0;
          this.initSearchList()
        },
        immediate:true
      },
    },
    computed:{
      ...mapState({
        isLogin: state=>state.isLogin,
        menuData: state=>state.menuData,
      }),
    },
    async mounted() {

    },
    methods:{
      async initSearchList(){
        let fromP = this.pageNum*this.pageSize;
        if(fromP < 6 ) this.$store.commit('modShowSkeletonLoader',{show:true, type:'search'});

        let version = JSON.parse(sessionStorage.getItem('version'));
        // this.items.push(...this.items.slice(0,10))
        let params = {searchText:this.$route.query.s, from:fromP, size:this.pageSize,version_id:version.id,category_id:version.categoryId};
        let fetchData = await this.$fetch(url_search_content ,params);
        this.fetchSuccess = true;
        if(!isEmpty(fetchData.data.hits.hits)){
          fetchData.data.hits.hits.forEach(i=>{
            let cateId = i._source.category_id;
            i.cate_1 = this.menuData.find(menus=>menus.child.find(i=>i.id==cateId));
            i.cate_2 = i.cate_1 && i.cate_1.child ? i.cate_1.child.find(i=>i.id==cateId) : [];
          });
          this.total = fetchData.data.hits.total.value;
          this.items.push(...fetchData.data.hits.hits);
        }else {
          this.busy = true;
        }
        this.$store.commit('modShowSkeletonLoader',{show:false, type:'search'});

      },

      loadMore(){
        if(this.pageNum*this.pageSize <= this.total){
          this.pageNum++;
          // console.log('滚动触底了:-----------------------------',this.pageNum);
          this.initSearchList();
        }else{
          this.busy = true;
        }

      }

    }

  };
</script>

<style lang="less">
  .search_list{min-height: 200px;}
  .search_list em{background: #ff0;}
</style>
