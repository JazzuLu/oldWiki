<template>

  <div v-if="popShow" :class="`${contentClass} tl_pop_container elevation-2`" :style="{top:formatUnit(y),left:formatUnit(x),...ppStyle}"
       v-dialog-drag="{handlerClass:'drag_header'}" v-dragResize="resizeDia" v-fix-axis="{y}">
    <div class="drag_dom">

      <v-timeline class="bbx-content-time-axis drag_header" vertical dense :style="taStyle">
        <v-timeline-item style="position: relative"
                         v-for="(item, index) in timeAxisData" :key="index"
                         :color="item.color"
                         small right icon="history">

<!--          <span slot="opposite" style="font-weight: bold;">{{item.user}}</span>-->

          <v-card class="elevation-3" style="width: 90%;border-radius: 8px;font-size: 12px;">
            <v-card-text>
              <div class="overflow-hidden">
<!--                <div class="tl_chip" :style="`background-color:${item.user ? item.color : ''};`" :title="item.user">{{item.user}}</div>-->
                <div class="tl_i_des" style="color: #666;">{{item.remark}}</div>
                <div class="tl_i_des">{{item.create_time}}</div>
              </div>
            </v-card-text>
          </v-card>

        </v-timeline-item>
      </v-timeline>

    </div>
  </div>

</template>

<script>

  export default {
    props: {
      menuShow: { type: Boolean, default: false },

      /** 类名 **/
      contentClass: { type: String, default(){return ''} },
      ppStyle: { type: Object, default(){return {}} },

      /** 位置信息 **/
      x: { type: [Number,String], default: 0 }, y: { type: [Number,String], default: 0 },

      timeAxisData: { type: Array, default: () => ([]) },

      /** 样式 **/
      taStyle:{ type: Object, default: () => ({}) },

    },
    data: () => ({
      popShow: false,

      resizeHeight: 350
    }),
    computed:{
      formatUnit(){
        return function (v) {
          return typeof v == 'string' ? v : v+'px';
        }
      }
    },
    watch: {
      menuShow(newValue, oldValue) {
        this.popShow = newValue;
        if(newValue){
          setTimeout(()=>{
            let $axis = $('.bbx-content-time-axis');
            // $axis.css({height:$axis[0].scrollHeight})
            $axis.css({height:($axis[0].scrollHeight>360 ? $axis[0].scrollHeight : '100%') })
          },200)
        }
      }
    },
    mounted() {
    },
    methods: {
      resizeDia(e){
        this.resizeHeight = $(e.target).height();
      }
    }
  }
</script>

<style>
  .tl_pop_container{background:#fff;width:400px;height: 350px;position:absolute;z-index: 100000;font-size: 13px;}
  .drag_dom{width: 100%;height: 100%;overflow-x: hidden;overflow-y: auto;}

  .bbx-content-time-axis{overflow-y:auto; height:360px; margin-left: 10px; margin-right: 10px; }
  .bbx-content-time-axis .tl_i_des{word-break: break-all;margin-left: 5px;font-size: 12px;}
  .bbx-content-time-axis .tl_chip{display: inline-block;word-break: break-all;height: 26px;line-height: 26px;padding: 0 6px;border-radius: 26px;color: #fff;overflow: hidden;font-size: 12px;}

</style>
