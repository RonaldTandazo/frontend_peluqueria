<template>
    <v-app>
        <ToolBar></ToolBar>
        <v-container>
            <h1>Home</h1>
        </v-container>
    </v-app>
</template>

<script>
    import ToolBar from '../components/General/ToolBar.vue';
    import { jwtDecode } from 'jwt-decode'
    import store from "../store/index"

    export default {
        name: 'DashboardPage',
        components: {
            ToolBar
        },
        mounted() {
            const token = localStorage.getItem('jwt');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userData = decodedToken.user_data;
                const permissions = decodedToken.permissions || [];
                const menus = decodedToken.menus || [];
                
                // Llama a las acciones para actualizar el estado en Vuex
                store.dispatch('updateUserData', userData);
                store.dispatch('updatePermissions', permissions);
                store.dispatch('updateMenus', menus);
            }
        },
    }
</script>
  