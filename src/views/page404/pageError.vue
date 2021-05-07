<template>

    <v-app id="inspire" v-scroll=''>
        <v-layout class="full_screen" :style="`background: url(${login_bg}) no-repeat`">

            <div class="mx-auto d-flex align-center flex-column justify-center">
                <img class="" :src="IMGError" width="400px" max-width="400px">
                <p style="font-size: 36px; margin-bottom: 0; color: #049b5c;"><b> Opps!!</b></p>
                <p style="font-size: 18px">Something Went Wrong. Please try again later</p>
                <v-btn class="success" style="text-transform: none;" @click="$router.go(-1)"> Back to Safety </v-btn>

            </div>
        </v-layout>
    </v-app>
</template>

<script>
import IMGError from '../../assets/error.svg'
import login_bg from '@/assets/login_bg.svg'

export default {
    name: "page403",
    data(){
        return{
            IMGError,
            login_bg
        }
    }

}
</script>

<style scoped>

</style>