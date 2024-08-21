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
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model='email'
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a>
      </div>

      <v-text-field
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

      <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="login"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <router-link
          class="text-blue text-decoration-none"
          to="/signup"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { authService } from '../services/authService';
  import { roleService } from '../services/roleService';

  export default {
    data: () => ({
      visible: false,
      disabled: false, 
      loading: false,
      email:'',
      password:'',
      debounceTimeout: null
    }),

    watch: {
      email(newEmail) {
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        
        this.debounceTimeout = setTimeout(() => {
          if (newEmail) {
            this.get_user_roles(newEmail);
          }
        }, 1000);
      }
    },

    methods: {
      async get_user_roles(email) {
        try {
          console.log(email)
          const roles = await roleService.get_user_roles(email);
          console.log('Roles fetched:', roles);
        } catch (error) {
          this.$emit('notify', {message:"Role Search Failed", ok:false, show: true});
        }
      },

      async login() {
        try {
          this.disabled = true
          this.loading = true
          
          const response = await authService.loginUser({
            email: this.email,
            password: this.password,
          });
            
          console.log("la wbd despues del response")
          console.log(response)
          this.successMessage = response.message || 'Login successful'; // Maneja la respuesta aquí
          this.$router.push('/home');
        } catch (error) {
          this.disabled = false
          this.loading = false
          this.$router.push('/signup');
          this.$emit('notify', {message:"Login Failed", ok:false, show: true});
        }
      },
    },
  }
</script>