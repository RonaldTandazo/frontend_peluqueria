<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Full Name
      </div>

      <v-text-field
        v-model="username"
        density="compact"
        placeholder="Full Name"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        E-mail
      </div>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="register"
      >
        Submit
      </v-btn>

      <v-card-text class="text-center">
        Do you have Account?
        <router-link
          class="text-blue text-decoration-none"
          to="/login"
        >
          Log in <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
  import { authService } from '../services/authService';

  export default {
    data: () => ({
      visible: false,
      disabled: false,
      loading: false,
      username: '',
      email: '',
      password: '',
    }),

    methods: {
      async register() {
        try {
          this.disabled = true
          this.loading = true
          
          const response = await authService.registerUser({
            username: this.username,
            email: this.email,
            password: this.password,
          });
            
          this.successMessage = response.message || 'Registration successful'; // Maneja la respuesta aquí
          this.$router.push('/login');
        } catch (error) {
          this.$emit('notify', {message:"Registration Failed", ok:false, show: true});
        } finally {
          this.loading = false
          this.disabled = false
        }
      },
    },
  }
</script>