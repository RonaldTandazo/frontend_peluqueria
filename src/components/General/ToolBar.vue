<template>
    <div>
        <v-app-bar
            prominent
        >
            <v-toolbar color="blue-accent-2">
                <v-spacer></v-spacer>
                <UserActions class="mr-5"/>
            </v-toolbar>
        </v-app-bar>
    </div>
</template>

<script>
    import UserActions from "./UserActions.vue"

    export default {
        name:"ToolBar",
        components: {
            UserActions
        }
    }
</script>
