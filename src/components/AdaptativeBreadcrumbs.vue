<template>
    <div>
        <v-breadcrumbs :items="routes">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
        </v-breadcrumbs>
    </div>
</template>
<script>
    export default {
        data: () => ({
        }),
        props: {
            routes:{
                type: String
            }
        }
    };
</script>
