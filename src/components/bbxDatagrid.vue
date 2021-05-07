<template>
  <div :class="{bbx_tab_container:!hideHeader,bbx_tab_container_no_header:hideHeader,'bbx_box_shadow':true,hideLastBorder:!showFootbar,}"
       :style="{paddingBottom:hidePage&&showFootbar?`52px`:`15px`,}">

    <div v-if="!hideHeader">
      <span class="bbt_caption grey darken-4"> {{caption}} </span>

      <div class="bbt_search_tab" v-if="searchable">
        <v-text-field v-model="search" append-icon="search" label="搜索" single-line hide-details dense></v-text-field>
      </div>
    </div>

    <!--  v-model="selected"  -->
    <v-data-table :headers="headers" :items="desserts" :class="{bbt_table:true,'mt-3':searchable && !hideHeader}" ref="bbDataGrid" class="bbx_datagrid"
                  v-model="mySelected" :hide-default-footer="hidePage" :loading="loading" :search="searchBind ? search : ''">
      <v-progress-linear v-slot:progress class="primary" indeterminate></v-progress-linear>
      <template v-slot:item="props">
        <!--        {{props.item}}-->
        <slot name="cells" :item="props.item"> </slot>
      </template>

      <template v-slot:footer.page-text="props">
        {{ props.pageStart }} - {{ props.pageStop }} / {{ props.itemsLength }}
      </template>
    </v-data-table>

    <div class="bbt_footbar" v-if="showFootbar">
      <slot name="footbar"> </slot>
    </div>

  </div>
</template>

<script>
  import {cloneDeep,find} from 'lodash'

  export default {
    name: "bbxDatagrid",
    props:{
      field:{ type:Array,default(){return []} },
      cellData:{ type:Array,default(){return []} },
      caption:{ type:String,default(){return ''} },

      hideHeader:{ type:Boolean,default(){return false} },

      loading:{ type:Boolean,default(){return false} },
      hidePage:{ type:Boolean,default(){return false} },     /** 是否显示底部 page 分页 **/
      showFootbar:{ type:Boolean,default(){return true} },  /** 显示底部 slot（自定义的新增/删除按钮） **/
      searchable:{ type:Boolean,default(){return true} },   /** 显示搜索框(默认前端进行搜索，可以通过 searchBind 属性进行控制) **/
      searchBind:{ type:Boolean,default(){return true} },   /** 通过前端搜索还是后端搜索 true：前端搜索 false：后端搜索 **/

      selected:{ type:Array,default(){return []} },
    },
    data () {
      return {
        headers: [ ],
        desserts: [ ],
        search: '',
        mySelected:[],
      }
    },
    watch:{
      field:{
        handler(nv){
          if(nv.length){ this.headers = nv; }
        }, immediate:true,
      },
      cellData:{
        handler(nv){
          if(nv.length) { this.desserts = nv; }else{ setTimeout(()=>{$('.v-data-footer__pagination,.v-data-footer__select').hide()},0) }
        }, immediate:true,
      },
      selected(nv){
        this.mySelected = nv;
      },
    },
    mounted() {
    }


  }
</script>

<style>
  .bbx_tab_container_no_header{position: relative;background: #fff;padding: 0 20px;margin-top: 0;border-radius: 5px;font-size: 16px;}
  .bbx_tab_container{position: relative;background: #fff;padding: 25px 20px 0;margin-top: 20px;border-radius: 5px;font-size: 16px;}
  .bbx_tab_container .v-data-footer{ height: 52px;margin-bottom: -8px;}

  .bbt_caption{ padding: 10px 20px;color: #fff;position: absolute;top: -15px;border-radius: 5px; }
  .bbt_search_tab{width:250px;position: absolute;top: 0px;right: 20px; }
  .bbt_search_tab label,.bbt_search_tab input{ font-size: 14px; }

  .bbt_footbar{ position: absolute;bottom: 10px; }
  .bbx_tab_container .theme--light.v-table tbody tr {border-bottom: 1px solid rgba(0,0,0,.12);}
  .hideLastBorder .theme--light.v-table tbody tr:last-child {border-bottom: 0;}

  .bbx_datagrid tbody td, .bbx_datagrid tbody th { height: 36px !important; }
  .bbx_datagrid thead tr { height: 36px !important; }
</style>
