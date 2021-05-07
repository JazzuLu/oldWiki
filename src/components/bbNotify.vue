<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

  <notifications :max='6' animation-name="v-fade-left" ref="m_notify">

    <template v-slot:body="props">

      <!--        <v-alert icon="success" :value="true" dismissible :type="props.item.type" transition="scale-transition">-->
      <div @click="destroyNotify(props)">
        <v-alert :icon="iconType[props.item.type]" :type="props.item.type" transition="scale-transition">
          <div class="subheading">{{props.item.title}}</div>
          <div class="body-2">{{props.item.text}}</div>
        </v-alert>
      </div>

    </template>

  </notifications>

</template>

<script>
  export default {
    data:()=>{
      return{
        iconType:{
          success:'check',
          error:'error',
          info:'info',
          warning:'warning',
        }
      }
    },
    methods:{
      destroyNotify(props){
        // console.log('destroyNotify',props,this.$refs.m_notify);
        props.close();
      }
    }


  }
</script>

<style lang="less">

  /* notifications */

  .notifications{
    top:48px !important;

  }

  .v-fade-left-enter-active,
  .v-fade-left-leave-active,
  .v-fade-left-move {
    transition: all .2s;
  }
  .v-fade-left-enter,
  .v-fade-left-leave-to {
    opacity: 0;
    transform: translateX(200px) scale(0.2);
  }
</style>
