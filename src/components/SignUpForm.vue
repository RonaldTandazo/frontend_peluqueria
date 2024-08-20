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
      username: '',
      email: '',
      password: '',
      errorMessages: []
    }),

    methods: {
    async register() {
      try {
        console.log("la wbd en el try")
        const response = await authService.registerUser({
          username: this.username,
          email: this.email,
          password: this.password,
        });
          
        console.log("la wbd despues del response")
        console.log(response)
        this.successMessage = response.message || 'Registration successful'; // Maneja la respuesta aquí
        this.$router.push('/');
      } catch (error) {
        console.log(error)
        this.errorMessages.push(error.message || 'Registration failed');
      }
    },
  },
  }
</script>