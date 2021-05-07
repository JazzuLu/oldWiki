<template>

    <v-app id="inspire" v-scroll=''>
        <v-layout class="full_screen" :style="`background: url(${login_bg}) no-repeat`">

            <div class="mx-auto d-flex align-center flex-column justify-center">
                <img class="" :src="IMG404" width="400px" max-width="400px">
                <p style="font-size: 36px; margin-bottom: 0; color: #fa3939;"><b>Not Found!!</b> </p>
                <p style="font-size: 18px">The page you're looking for isn't available</p>
                <v-btn class="success" style="text-transform: none;" @click="$router.go(-1)"> Back to Safety </v-btn>

            </div>
        </v-layout>
    </v-app>
</template>

<script>
import IMG404 from '../../assets/404.svg'
import login_bg from '@/assets/login_bg.svg'

export default {
    name: "page404",
    data(){
        return{
            IMG404,
            login_bg
        }
    }

}
</script>

<style scoped>

</style>