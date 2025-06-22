<template>
    <v-alert
      v-if="info.show"
      v-model="alert"
      class="custom-notification"
      closable
      border="start"
      :icon="info.ok ? '$success':'$error'"
      :title="info.message"
      :color="info.ok ? 'success':'red-accent-2'"
      variant="outlined"
      text-color="black"
    ></v-alert>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
        default: () => ({message:'', ok: true})
      }
    }
  }
</script>

<style scoped>
  .custom-notification {
    background-color: white;
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    z-index: 9999;
  }
</style>
