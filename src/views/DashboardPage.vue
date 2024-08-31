<template>
    <v-app>
        <v-app-bar>
            <v-toolbar
                title="Application"
            >
                <v-spacer></v-spacer>
                <UserAccount />
            </v-toolbar>
            <!-- <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn> -->
            <!-- <v-btn icon>
                <v-icon>mdi-logout</v-icon>
            </v-btn> -->
        </v-app-bar>

        <!-- <v-main> -->
            <!-- Aquí puedes colocar el contenido principal del dashboard -->
            <!-- <v-container>
                <p>Contenido del dashboard</p>
            </v-container>
        </v-main> -->
    </v-app>
</template>

<script>
    import UserAccount from '../components/UserAccount.vue';
    
    export default {
        name: 'DashboardPage',
        components: {
            UserAccount
        },
        data() {
            return {};
        },
    }
</script>
  