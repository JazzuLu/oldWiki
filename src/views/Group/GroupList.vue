<template>
  <div class="df_content">
    <bbxDatagrid style="width: 100%;" caption="用户组" :field="fields" :cellData="cellData" :selected="[selectRowData]" :loading="loadingTab">
      <template v-slot:cells="props">
        <tr @click="selectCol(props.item)" @dblclick="$router.push({path:`/group/${props.item.id}`,query:{...$route.query}})" :class="{'v-data-table__selected':props.item==selectRowData}">
          <td class="text-center">{{props.item.id}}</td>
          <td class="text-center">{{props.item.name}}</td>
        </tr>
      </template>
      <template v-slot:footbar>
        <v-btn class="add-btn" small icon to="/group/-1"> <v-icon color="#00bcd4 !important">add</v-icon> </v-btn>
<!--        <v-btn class="delete-btn" small icon :disabled="deleteBtnDisabled" @click="deleteRow"> <v-icon color="red !important">delete</v-icon> </v-btn>-->
      </template>
    </bbxDatagrid>
  </div>
</template>

<script>

  import bbxDatagrid from '@/components/bbxDatagrid.vue'

  import {cloneDeep,find,uniqBy, isArray} from 'lodash'
  import {
    url_group_list,
  } from '../../util/api'

  /** 默认分组的弹窗对象 **/
  const SUB_USER_DATA = { code:"",name:"", }

  export default {
    name: "Groups",
    components:{
      bbxDatagrid,
    },
    data(){
      return{
        /** 以下为表格数据 **/
        fields:[],
        cellData:[],
        selectRowData:{},
        loadingTab:false,
        deleteBtnDisabled: true,

        /** 新增相关 **/
        addRowFloat:false,
        curGroupData:cloneDeep(SUB_USER_DATA),
      }
    },
    computed: {
    },
    mounted() {
      this.initColTable();
    },
    methods:{
      /** 初始化表格数据 **/
      async initColTable(){
        this.fields = [
          { text: '#', align: 'center', sortable: true, value: 'index' },
          { text: "组名", align: 'center', sortable: false, value: 'name' },
        ];
        this.loadingTab = true;
        let fetchList = await this.$fetch(url_group_list);
        if(fetchList.status) return;
        this.loadingTab = false;
        fetchList.data.forEach((i,idx)=>{
          i.index = idx+1;
        });
        this.cellData = fetchList.data;
      },

      /** 选择一行 **/
      selectCol(selected){
        if(selected.reserved==0) {
          this.deleteBtnDisabled = false;
          this.selectRowData = selected;
        }
      },

      /** 删除用户 **/
      async deleteRow(){

      }

    },

  }

</script>

<style scoped>
  .bbx_users_panel{padding: 15px 15px 0;max-height: 15vh;overflow-y: auto;}
</style>
