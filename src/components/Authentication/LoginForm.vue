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
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Acceso</div>
      <v-text-field
        v-model='email'
        density="compact"
        placeholder="Ingrese su email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Ingrese su contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        :disabled="disabled"
        :loading="loading"
      ></v-text-field>

      <v-btn
        v-model="login_btn"
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="onLogin"
        :disabled="!isLoginDisable"
      >
        Iniciar Sesión
      </v-btn>

      <v-card-text class="text-center">
        <router-link
          class="text-blue text-decoration-none"
          to="/signup"
        >
          Registrarse <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { authService } from '../../services/authService';
  import { jwtDecode } from 'jwt-decode'
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data: () => ({
      visible: false,
      disabled: false, 
      loading: false,
      email:'',
      password:'',
    }),

    computed: {
      ...mapGetters('auth', ['getUserData']),
      isLoginDisable(){
        return this.email != '' && this.password != '';
      }
    },

    methods: {   
      ...mapActions('auth', ['login', 'logout']),

      async onLogin() {
        try {
          this.disabled = true
          this.loading = true

          const response = await authService.loginUser({email: this.email, password: this.password});
          console.log(response)
          if (response.data) {
            const token = response.data
            localStorage.setItem('jwt', token);
            
            const decodedToken = jwtDecode(token);
            const userData = decodedToken;
            
            this.login({ userData });
            
            this.$router.push('/home');
          }
        } catch (error) {
          console.log(error)
          this.$emit('notify', {message:error.message, ok:false, show: true});
        } finally {
          this.loading = false
          this.disabled = false
        }
      },
    }
  }
</script>