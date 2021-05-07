<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app id="inspire" v-scroll=''>
    <v-layout class="full_screen" :style="`background: url(${login_bg}) no-repeat`">
      <v-card class="d-flex mx-auto wiki_login" style="margin-top:30vh;">
        <v-layout class="mx-auto title mb-4" align-center >
          <img class="mr-3" :src="logoIcon" width="40">
          <span class="font-weight-light mr-3">bluebee WIKI</span>
        </v-layout>

        <v-text-field style="font-size: 12px;" outlined dense prepend-inner-icon="person" placeholder="账户" v-model="bbUsername" @keyup.enter="subLogin"></v-text-field>
        <v-text-field style="font-size: 12px;" outlined dense prepend-inner-icon="person_pin" placeholder="密码" type="password" v-model="bbPassword"> @keyup.enter="subLogin"</v-text-field>
        <v-text-field style="font-size: 12px;" outlined dense prepend-inner-icon="check_circle" placeholder="验证码" v-model="code"  :class="valid_code_class" @keyup.enter="subLogin">
          <template v-slot:append="">
            <span class="v-code-span mt-1" @click="refreshCode" style="cursor: pointer;font-size: 16px;">{{checkCode}}</span>
          </template>
        </v-text-field>

        <v-btn class="mt-0" color="secondary" @click="subLogin">登录</v-btn>
      </v-card>
    </v-layout>
  </v-app>
</template>

<script>

  import login_bg from '@/assets/login_bg.svg'
  import logoIcon from '@/assets/logo.png'

  import {url_post_login} from '../../util/api'
  import {mapMutations} from 'vuex'

  import md5 from 'js-md5';

  export default {
    components: {

    },
    data:()=>{
      return {
        login_bg,
        logoIcon,

        // 登录信息
        // bbUsername:'administrator',
        // bbPassword:'e10adc3949ba59abbe56e057f20f883e',
        bbUsername:'',
        bbPassword:'',
        code:'',
        checkCode:'',
        loginBtn:false,

        errShow:false
      }
    },
    watch:{
      bbUsername(newVal){
        this.loginBtn = !!(newVal && this.bbPassword);
      },
      bbPassword(newVal){
        this.loginBtn = !!(newVal && this.bbUsername);
      },
    },
    computed:{
      valid_code_class(){
        let className = '';
        if(this.checkCode.toLocaleLowerCase()===this.code.toLocaleLowerCase()){ className = 'login-code-valid' }
        return className
      }
    },
    mounted() {
      this.loginBtn = !!(this.bbUsername && this.bbPassword);
      this.refreshCode()
    },
    methods:{
      ...mapMutations(['changeLogin']),
      async subLogin(){
        if(this.checkCode.toLocaleLowerCase()!=this.code.toLocaleLowerCase()){ this.$notify({ type: 'error', title: '请检查验证码',});return ; }
        let params = {
          user_name:this.bbUsername,
          password:md5(this.bbPassword),
          from_wiki:1,
        };
        let fetchLogin = await this.$fetch(url_post_login,params,'post');
        if(!fetchLogin.status){
          this.changeLogin({ Authorization: fetchLogin.data.token, ...fetchLogin.data })
          this.$router.push('/')
        }else{
          this.$notify({ type: 'error', title: fetchLogin.message,});
        }

      },

      // 刷新验证码
      refreshCode(){ this.checkCode = this.createCode() },
      createCode(){
        let code = "";
        const codeLength = 4; //验证码的长度
        const random = [2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',  'M', 'N', 'P', 'Q', 'R','S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; //随机数
        for(let i = 0; i < codeLength; i++) { //循环操作
          let index = Math.floor(Math.random() * 31); //取得随机数的索引（0~35）
          code += random[index]; //根据索引取得随机数加到code上
        }
        return code
      },

    }

  };
</script>

<style lang="less">
  .full_screen{width: 100%;height: 100%;}
  .wiki_login{flex-direction: column;height: 345px;width: 320px;padding: 28px 40px;}

  .login-code-valid .v-icon{ color: #91bc29 !important; }
</style>
