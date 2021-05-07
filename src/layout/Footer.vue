<template>
  <v-footer padless inset color="grey lighten-3">
    <v-layout justify-center align-center :column="$vuetify.breakpoint.xs" :style="!$vuetify.breakpoint.xs ? `height: 30px;` : ``">
      <span class="mr-4" style="color: #999999;line-height: 18px;">&copy; {{ new Date().getFullYear() }} 喜科（上海）软件系统有限公司 • All Rights Reserved</span>
      <span class="align-center" style="display: flex;height: 18px;">
        <a class="logo-choosit" rel="nofollow" style="color: #999999;" depressed href="http://www.miibeian.gov.cn/">沪ICP备12006929号-3&nbsp;&nbsp;&nbsp;</a>
      </span>
    </v-layout>
  </v-footer>
</template>

<script>


  export default {
    components:{
    },
    props: {
    },
    data: () => ({

    }),
  }
</script>

<style lang="less">
  .v-footer {
    font-size: 12px;
    a {
      text-decoration: none;
      font-size: 12px;
      color: #333333;
    }
  }

</style>