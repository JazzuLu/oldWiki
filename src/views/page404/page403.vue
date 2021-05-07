<template>

    <v-app id="inspire" v-scroll=''>
        <v-layout class="full_screen" :style="`background: url(${login_bg}) no-repeat`">

            <div class="mx-auto d-flex align-center flex-column justify-center">
                <img class="" :src="IMG403" width="400px" max-width="400px">
                <p style="font-size: 36px; margin-bottom: 0; color: #ff5d0a;"><b>Forbidden!!</b> </p>
                <p style="font-size: 18px">Looks like you're not authorized to access this page</p>
                <v-btn class="success" style="text-transform: none;" @click="$router.go(-1)"> Back to Safety </v-btn>

            </div>
        </v-layout>
    </v-app>
</template>

<script>
import IMG403 from '../../assets/403.svg'
import login_bg from '@/assets/login_bg.svg'

export default {
    name: "page403",
    data(){
        return{
            IMG403,
            login_bg
        }
    }

}
</script>

<style scoped>

</style>