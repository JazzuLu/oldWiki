<template>
  <div class="page_skeleton_loader" v-if="showSkeletonLoader">
    <div v-if="showSkeletonLoaderType=='home'">
      <v-row>
        <v-col cols="2"><v-skeleton-loader type="list-item-three-line@3"></v-skeleton-loader></v-col>
        <v-col cols="10">
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="article" style="height: 140px;"></v-skeleton-loader></v-col></v-row>
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="paragraph" class="px-4"></v-skeleton-loader></v-col></v-row>
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="paragraph" class="px-4"></v-skeleton-loader></v-col></v-row>
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="article" style="height: 120px;"></v-skeleton-loader></v-col></v-row>
        </v-col>
      </v-row>
    </div>
    <div v-if="showSkeletonLoaderType=='search'">
      <v-row>
        <v-col cols="12">
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="article" style="height: 140px;"></v-skeleton-loader></v-col></v-row>
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="article" style="height: 140px;"></v-skeleton-loader></v-col></v-row>
          <v-row><v-col v-for="n in 1" :key="n"><v-skeleton-loader type="article" style="height: 120px;"></v-skeleton-loader></v-col></v-row>
        </v-col>
      </v-row>
    </div>
    <v-skeleton-loader v-else :type="showSkeletonLoaderType" ></v-skeleton-loader>
  </div>
</template>
<script>

  /*
  *   网页 骨架 loading 使用方法
  *
  *    // 显示页面 骨架 loading
  *    this.$store.commit('modShowSkeletonLoader',{show:true, type:type});
  *    or    this.$store.state.showSkeletonLoader = true;    this.$store.state.showSkeletonLoaderType = 'type';
  *    // 隐藏 骨架 loading
  *    this.$store.commit('modShowSkeletonLoader',false);    or    this.$store.state.showSkeletonLoader = false;
  *
  * */
  import {mapState} from 'vuex'

  const TYPE = {
    "actions": "button@2",
    "article": "heading, paragraph",
    "avatar": "avatar",
    "button": "button",
    "card": "image, card-heading",
    "card-avatar": "image, list-item-avatar",
    "card-heading": "heading",
    "chip": "chip",
    "date-picker": "list-item, card-heading, divider, date-picker-options, date-picker-days, actions",
    "date-picker-options": "text, avatar@2",
    "date-picker-days": "avatar@28",
    "heading": "heading",
    "image": "image",
    "list-item": "text",
    "list-item-avatar": "avatar, text",
    "list-item-two-line": "sentences",
    "list-item-avatar-two-line": "avatar, sentences",
    "list-item-three-line": "paragraph",
    "list-item-avatar-three-line": "avatar, paragraph",
    "paragraph": "text@3",
    "sentences": "text@2",
    "table": "table-heading, table-thead, table-tbody, table-tfoot",
    "table-heading": "heading, text",
    "table-thead": "heading@6",
    "table-tbody": "table-row-divider@6",
    "table-row-divider": "table-row, divider",
    "table-row": "table-cell@6",
    "table-cell": "text",
    "table-tfoot": "text@2, avatar@2",
    "text": "text"
  }

  export default {
    props: {
      // show: Boolean,
      // type: { type:String, default:()=> 'heading, table-heading, table-thead' },
    },
    computed:{
      ...mapState({
        showSkeletonLoader:state => state.showSkeletonLoader,
        showSkeletonLoaderType:state => state.showSkeletonLoaderType,
      })
    },
    data() {
      return {
      }
    },

  }
</script>
<style>

  /****** LOADER ******/
  .page_skeleton_loader { position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: rgba(255,255,255,1); z-index: 100500;padding: 50px; }


</style>
