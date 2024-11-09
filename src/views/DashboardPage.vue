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

    export default {
        name: 'DashboardPage',
        components: {
            ToolBar
        }
    }
</script>
  