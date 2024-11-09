<template>
    <div>
        <v-breadcrumbs :items="routes">
            <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item :key="item.title" :disabled="item.disabled">
                    <span
                        @click="!item.disabled && navigateTo(item)"
                        :class="{ 'clickable-breadcrumb': !item.disabled }"
                    >
                        {{ item.title }}
                    </span>
                </v-breadcrumbs-item>
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
                type: Array,
                required: true
            }
        },

        methods: {
            navigateTo(item) {
                this.$router.push(item.href);
            }
        }
    };
</script>

<style scoped>
    .clickable-breadcrumb {
        cursor: pointer;
    }
    .clickable-breadcrumb:hover {
        text-decoration: underline;
    }
</style>
