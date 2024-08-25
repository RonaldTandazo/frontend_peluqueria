<template>
  <router-view @notify="triggerNotification" />
  <v-slide-x-reverse-transition>
    <NotificacionAlert :info="notificationMessage" v-if="showNotification" />
  </v-slide-x-reverse-transition>
</template>

<script>
import NotificacionAlert from "../components/NotificationAlert.vue";

export default {
  name: 'HomePage',
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
      }, 5000); // Oculta la notificación después de 5 segundos
    }
  }
}
</script>
