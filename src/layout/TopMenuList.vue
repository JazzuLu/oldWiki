
<template>
  <!-- 子菜单 -->

  <div>

    <!--  不含有子菜单的按钮（需要递归）  -->
    <v-list  v-if="item.children && item.children.length>0"
             :value="item.active" class="tm_list"
             :style="item.level==1 ? `width:100px `: ``"
    >
      <v-btn flat @click="fnShowChildren(item.level)" ref="float_btn"
             :class="`pl-1 pr-2 tm_btn ${item.level==1 ? `` : `normal-menu`} ${item.active ? `${themeColor.colorName!='light' ? `active-parent-d` : `active-parent-l`}` : ``}`"
             :style="vBTNStyle(item.level)"
      >
        <!--    正常显示的文字    -->
        <span :class="`state-cell-name ${item.level!=1 ? `pl-2` : `pl-1`}`"
              v-if="item.text!='查看更多'"
              :title="item.text"
        >{{item.text}}</span>
        <!--    查看更多的icon    -->
        <i class="material-icons" v-else style="line-height: 64px">more_horiz</i>
        <!--    子菜单的icon（右箭头）（第一层不显示）    -->
        <i v-if="item.level!=1" class="material-icons pr-2">keyboard_arrow_right</i>
      </v-btn>

      <!--   递归的地方   -->
      <v-card :class="item.level>=2 ? 'side' : 'mt-2'"
              :style="vCardStyle(item.level)"
              ref="float_card"
              v-if="childrenMenuShow">
        <template>
          <div v-for="child in item.children" :key="child.id">
            <TopMenu :item="child" :key="child.id" :themeColor="themeColor"></TopMenu>
          </div>
        </template>
      </v-card>
      <!--   递归的地方   -->
    </v-list>

    <!--  不含有子菜单的按钮（叶子节点）（不需要递归）  -->
    <v-btn flat v-else :to="item.link" :style="vBTNStyle(item.level)"
           :class="`pl-3  tm_btn ${item.level==1 ? `` : `normal-menu pr-3`} ${item.active ? `${themeColor.colorName!=`light` ? `active-menu-d` : `active-menu-l` }` : ``}`"
    >
      <span :class="item.level!=1 ? `state-cell-name` : `pl-1 state-cell-name`"
            :title="item.text"
      >{{item.text}}</span>
      <span></span>
    </v-btn>

  </div>

</template>

<script>
  /**
   * @author:pancras
   * @description: 顶部菜单展示组件
   * 调用本菜单必须含有 level 字段
   * @api：
   *
   */


  export default {
    name:'TopMenu',
    props:{
      item:{
        type:Object,
        default:{}
      },
      top:{
        type:Boolean,
        default:false
      },
      themeColor:{
        type:Object,
        default:{}
      }
    },
    data:()=>({
      // 是否显示孩子菜单
      childrenMenuShow:false,

      // 节点level大于二的 孙子菜单的left
      grandSonMenuLeft:120,

      // 固定一级menu的宽度
      fixLevelOneWidth: '',
    }),
    methods:{
      // 点击其他区域隐藏
      tapOutside(e){
        if(this.$refs.float_card){
          if(!this.$refs.float_card.$el.contains(e.target)){
            this.childrenMenuShow = false;
          }
          // 防止再次点击btn不生效
          if(this.$refs.float_btn.$el.contains(e.target)){
            this.childrenMenuShow = true;
          }
        }
      },

      // 点击显示子菜单
      fnShowChildren(level){
        this.childrenMenuShow = !this.childrenMenuShow;
        // 给子菜单加上左边距
        this.grandSonMenuLeft = this.$refs.float_btn.$parent.$el.offsetWidth + 10;
        if(level==1){
          this.fixLevelOneWidth = this.$refs.float_btn.$parent.$el.clientWidth;
        }
      }

    },
    mounted() {
      window.addEventListener('click',this.tapOutside,true)
    },
    destroyed() {
      window.removeEventListener('click',this.tapOutside)
    },
    computed:{
      vCardStyle(level){
        return function (level) {
          if(level!=1){
            if(level>=2){
              // return `left:${this.grandSonMenuLeft+`px;`}`
              return `left:${160+`px;`};width:150px`
            }
          }else{
            return `width:150px`
          }
        }
      },
      vBTNStyle(level){
        return function (level) {
          if(level!=1){
            return `width:150px;height:48px;`
          }else{
            return `height:64px;`
          }
        }
      },

    }

  }

</script>

<style >
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .tm_list{position: relative;padding: 0;cursor: pointer;background-color: transparent !important;}

  .li_title{height: 64px;}
  .side{position: absolute;top: 0;left: 130px;transition: .5s all ease;}
  .v-list .normal-menu{height: 50px;line-height: 50px;}
  .tm_btn{width:80px;height: 64px;line-height: 64px;text-align: center;}
  .tm_btn .v-btn__content{justify-content: space-between;}
  .tm_btn .material-icons{text-align: right;}

  /* 多余部分显示。。。 */
  .state-cell-name{
    display: inline-block;
    width: 110px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*.active-menu{color: aquamarine;}*/
  .active-menu-d{background-color: rgb(88,88,88);}
  .active-parent-d{background-color: rgb(59,59,59);}

  .active-menu-l{background-color: rgb(220,220,220);}
  .active-parent-l{background-color: rgb(229,229,229);}



</style>
