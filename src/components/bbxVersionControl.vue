<template>
  <div class="vc_ipt">
    <v-autocomplete v-model="select" :items="versions" :label="label" :dense="dense" multiple outlined
                    itemText="version" itemValue="id" hide-details @change="$emit('returnBack',select)">
      <template v-slot:prepend-inner="">
        <div style="margin-top: 4px;" class="excess_word" v-showTitle>{{versions.filter(v=>select.find(s=>s==v.id)).map(v=>v.version).join(',')}}</div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    model:{
      prop:'value',
      event:'returnBack'
    },
    props: {
      label: { type: [String], default:()=> '' },
      dense: { type: Boolean, default:()=> false },
      value: { type: [Array], default:()=> [] },
    },
    data: () => ({
      select:[]
    }),
    watch:{
      value:{
        handler(nv){ this.select = nv },immediate:true,
      }
    },
    computed:{
      ...mapState({
        versions: state=>state.versions,
      }),
    },
    mounted: function () {

    },
    methods: {

    }
  }
</script>

<style>
  .v-autocomplete__content .v-list--dense .v-list-item .v-list-item__action{margin: 10px 15px 10px 0;}
  .vc_ipt .v-select.v-input .v-input__slot{padding: 0 5px 0 10px!important;}
  .vc_ipt .v-select.v-input .v-input__slot .v-select__slot{ position: initial;}
  .vc_ipt .v-select.v-input .v-input__slot .v-select__selection{display: none;}
  .vc_ipt .v-select.v-input .v-input__slot .v-input__prepend-inner{max-width: calc(100% - 30px);}
  .vc_ipt .v-select.v-input .v-input__slot label{left: 12px!important;}

</style>
