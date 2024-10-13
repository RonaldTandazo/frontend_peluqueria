<template>
    <router-view @notify="triggerNotification" @recover-success="RecoverSuccess"/>
    <v-slide-x-reverse-transition>
        <NotificacionAlert :info="notificationMessage" v-if="showNotification" />
    </v-slide-x-reverse-transition>
</template>
  
<script>
    import NotificacionAlert from "../../components/General/NotificationAlert.vue";
    import { mapMutations } from 'vuex';

    export default {
        name: 'RecoveryPage',
        components: {
            NotificacionAlert
        },
        data() {
            return {
                showNotification: false,
                notificationMessage: {message: '', ok: true, show: false}
            };
        },
        methods: {
            triggerNotification(info) {
                this.notificationMessage = info;
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
            ...mapMutations(['setSuccessMessage']),
            RecoverSuccess(info) {
                this.setSuccessMessage({tittle: info.tittle, message: info.message, status: info.state})
                this.$router.push({ name: 'Success' });
            }
        }
    }
</script>