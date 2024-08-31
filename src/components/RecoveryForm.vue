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
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Account</div>
        <v-text-field
            clearable
            v-model='email'
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            :disabled="disabled"
            :loading="loading"
        ></v-text-field>
  
        <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="recover_password"
            :disabled="!isRecoverAvailable"
        >
            Recover Password
        </v-btn>
        
      </v-card>
    </div>
  </template>
  
  <script>
    import { authService } from '../services/authService';
  
    export default {
        data: () => ({
            disabled: false, 
            loading: false,
            email:'',
        }),

        computed: {
            isRecoverAvailable(){
                return this.email !== ''
            }
        },
  
        methods: {
            async recover_password() {
                this.disabled = true
                this.loading = true

                try {
                    const response = await authService.send_recover_email({email: this.email});

                    if(!response.success){
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                        return null
                    }

                    this.$emit('recover-success', {tittle: response.message, message: "Check yor email inbox, there's a link to reset your password", state: 200});

                } catch (error) {
                    this.$emit('notify', {message: error.message, ok:false, show: true});
                } finally {
                    this.loading = false
                    this.disabled = false
                }
            },
        }
    }
  </script>