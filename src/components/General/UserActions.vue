<template>
    <div class="text-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="end"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    class="user-icon"
                    v-bind="props"
                    density="comfortable"
                    icon="mdi-account"
                    variant="outlined"
                >
                </v-btn>
            </template>

            <v-card min-width="300">
                <v-list>
                    <v-list-item
                        prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                        :subtitle="userInfo ? userInfo.email:''"
                        :title="userInfo ? userInfo.username:''"
                    >
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item
                        key="2"
                        value="2"
                        @click="onLogout"
                    >
                        <v-list-item-title>
                            Logout
                        </v-list-item-title>
                        <template v-slot:append>
                            <v-icon
                                icon="mdi-logout"
                                color="red-accent-4"
                            ></v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    
    export default {    
        data: () => ({
            menu: false,
            userInfo: null
        }),

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
        },

        methods: {
            ...mapActions('auth', ['logout']),

            onLogout(){
                this.logout()
                this.$router.push({ name: 'LoginForm' });
            }
        },    
    }
</script>