<template>
  <v-app style="padding: 80px;">
    <v-expansion-panels>
      <v-expansion-panel
              v-for="(item,i) in 5"
              :key="i"
      >
        <v-expansion-panel-header expand-icon="expand_more">Item</v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }"> <v-btn small text v-on="on" v-bind="attrs">v1.5</v-btn> </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>111</v-list-item-title>
          <v-list-item-title>111</v-list-item-title>
          <v-list-item-title>111</v-list-item-title>
          <v-list-item-title>111</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app>
</template>

<script>
  /**
   * @author:liulifu
   * @description:自定义组件 测试页面
   */

  export default {
    components: {
    },
    data: () => ({

    }),
    mounted() {
    },
    watch: {
    },
    methods: {
    }

  }
</script>

<style>
</style>
