<template>
    <div class="text-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="end"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    color="indigo"
                    v-bind="props"
                    icon="mdi-account"
                >
                </v-btn>
            </template>

            <v-card min-width="300">
                <v-list>
                    <v-list-item
                        prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                        :subtitle="userInfo ? userInfo.email:''"
                        :title="userInfo ? userInfo.sub:''"
                    >
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item
                        append-icon="mdi-logout"
                        key="1"
                        value="1"
                        @click="logout"
                    >
                        <v-list-item-title>
                            Logout
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    import { jwtDecode } from 'jwt-decode'
    
    export default {    
        data: () => ({
            menu: false,
            userInfo: null
        }),

        mounted() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    this.userInfo = jwtDecode(token);
                    console.log(this.userInfo)
                } catch (error) {
                    console.error('Invalid token', error);
                }
            }
        },

        methods: {
            logout(){
                localStorage.removeItem('jwt');
                this.$router.push({ name: 'LoginForm' });
            }
        },    
    }
</script>