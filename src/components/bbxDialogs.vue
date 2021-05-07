<template>
  <v-layout row justify-center>

    <v-dialog :eager="eager" :max-width="maxWidth" :persistent="true" style="background: white;" v-model='dialogName'
              :width="width" :content-class="dioClass+` ${overflowHidden?`bbx-overflow-hidden`:``}`" ref="vDialog">

      <v-card style="position: relative;">
        <v-btn @click="close" color="primary" icon style="position: absolute; right: 0" text v-if="showCloseBtn">
          <v-icon>close</v-icon>
        </v-btn>
        <v-card-title> <span class="headline">{{title}}</span> </v-card-title>

        <v-card-text style="margin-top: 20px;">
          <div class="pa-3"> <slot name="body"> </slot> </div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn v-if="showCancelBtn" color="blue darken-1" text @click="cancel">取消</v-btn>
          <v-btn v-if="showConfirmBtn" color="blue darken-1" text @click="confirm">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

  export default {
    props: {
      eager: { type: Boolean, default: true },
      dialogName: { type: Boolean, default: false },
      title: { type: String, default: '' },
      confirmTxt: { type: String, default: '' },
      cancelTxt: { type: String, default: '' },
      width: { type: String, default: '600px' },
      minWidth: { type: String, default: '600px' },
      maxWidth: { type: String, default: 'auto' },
      showCancelBtn: { type: Boolean, default: true },
      showConfirmBtn: { type: Boolean, default: true },
      showCloseBtn: { type: Boolean, default: false },
      dioClass: { type: String, default() { return '' } },

      /** 防止下拉框溢出 **/
      overflowHidden: {type: Boolean, default: false},
    },
    data: () => ({}),
    watch:{
      dialogName(nv){
        if(nv){
          let _this = this;
          setTimeout(()=>{
            $('.v-dialog--active')[0].addEventListener("scroll", function(e) {
              // console.log('我滚了！！！！！')
              _this.$emit('scroll',e)
            });
          },0)
        }else{

        }
      }
    },
    mounted: function () {

    },
    methods: {
      cancel: function () {
        this.$emit('cancel')
      },
      confirm: function () {
        this.$emit('confirm')
      },
      close: function () {
        this.$emit('close')
      },
    }
  }
</script>

<style>
  .bbx-overflow-hidden{overflow: inherit !important;}
</style>
