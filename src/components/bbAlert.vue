<template>

  <v-dialog v-model="showDialog" max-width="290">
    <v-card>
      <v-card-title class="headline">确定删除?</v-card-title>

      <v-card-text>
        <!--        Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.-->
      </v-card-text>

      <v-card-actions>
        <div class="flex-grow-1"></div>

        <v-btn color="green darken-1" text @click="cancel" > Disagree </v-btn>

        <v-btn color="green darken-1" text @click="confirm" > Agree </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
  export default {
    props:{
      showDialog:{
        type:Boolean,
        default:()=>false
      }
    },
    data:()=>{
      return{

      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancel')

      },
      confirm: function () {
        this.$emit('confirm')
      }
    }


  }
</script>

<style lang="less">

</style>
