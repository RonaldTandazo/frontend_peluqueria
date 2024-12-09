<template>
    <v-app>
        <ToolBar pageTitle="Users"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Users</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel title="Search Filters">
                        <v-expansion-panel-text>
                            <v-row cols="12">
                                <v-col cols="3">
                                    <v-text-field
                                        v-model="identification"
                                        density="compact"
                                        label="Identification"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-card-account-details"
                                    >    
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" class="d-flex justify-start">
                                    <v-btn
                                        prepend-icon="mdi-account-plus"
                                        color="white"
                                        class="me-2"
                                        ref="modalBtn"
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        New User
                                    </v-btn>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="6" class="d-flex justify-end">
                                    <v-btn
                                        prepend-icon="mdi-eraser"
                                        color="black"
                                        class="me-2"
                                        @click="cleanFilters"
                                    >
                                        Clear
                                    </v-btn>
                                    <v-btn
                                        prepend-icon="mdi-cloud-search"
                                        color="blue-accent-2"
                                        @click="getAllUsers({page: 1, itemsPerPage})"
                                    >
                                        Search
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row>
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="users"
                            :items-length="totalItems"
                            item-value="user_id"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            no-data-text="No Users"
                            fixed-header
                            show-expand
                        >
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <div class="d-flex justify-center">
                                            <v-card style="margin-top: 10px; margin-bottom: 10px; width: 75%;">
                                                <v-data-table-virtual
                                                    :headers="nestedColumns"
                                                    :items="item.roles"
                                                    item-value="role_id"
                                                    fixed-header
                                                    no-data-text="No User Roles"
                                                >
                                                </v-data-table-virtual>
                                            </v-card>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table-server>
                    </div>
                </v-card>
            </v-row>
        </v-container>
        <v-dialog v-model="isModalOpen" max-width="600px">
            <PatientModal v-model="isModalOpen" @close="isModalOpen = false" @save="saveNewPatient" :state="state" :genders="genders" :record="record"/>
        </v-dialog>
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import { userService } from '@/services/userService';
    import { mapGetters } from 'vuex';

    export default {
        name: 'UsersAccess',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs
        },
        data: () => ({
            userInfo: null,
            record: null,
            state: 'new',
            isModalOpen: false,
            itemsPerPage: 5,
            routes: [
                {
                    title: 'Home',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Access Dashboard',
                    disabled: false,
                    href: '/access'
                },
                {
                    title: 'Users',
                    disabled: true,
                    href: '/access/users'
                }
            ],
            columns: [
                {title: '', key: 'data-table-expand' },
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Fullname", key: "fullname", align: 'center', sortable: false, width:"400px"},
                {title: "Identification", key: 'identification', align: 'center', sortable: false, width:"200px"},
                {title: "E-Mail", key: 'email', align: 'center', sortable: false, width:"200px"},
                {title: "Phone Number", key: 'phonenumber', align: 'center', sortable: false, width:"150px"},
                {title: "Age", key: 'age', align: 'center', sortable: false, width:"125px"},
                {title: "Gender", key: 'gender', align: 'center', sortable: false, width:"125px"},
                {title: "Status", key: 'status', align: 'center', sortable: false, width:"125px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
            ],
            nestedColumns: [
                { title: "#", key: "index", align: "center", sortable: false },
                { title: "Role", key: "role", align: "center", sortable: false },
                { title: "Status", key: "status", align: "center", sortable: false },
                { title: "Actions", key: "actions", align: "center", sortable: false }
            ],
            identification: null,
            loading: true,
            users: [],
            totalItems: 0,
            search: '',
        }),

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
            this.getAllUsers({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getAllUsers({ page, itemsPerPage }){
                try {
                    this.loading = true
                    const search = {
                        identification: this.identification,
                    }

                    const response = await userService.getAllUsers(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.pagination.totalElements;
                        this.users = response.data.users.map((user, index) => {
                            return {
                                index: index + 1,
                                user_id: user.user_id,
                                fullname: user.fullname,
                                identification: user.identification,
                                email: user.email,
                                phonenumber: user.phonenumber,
                                gender: user.gender,
                                age: user.age,
                                status: user.status,
                                roles: user.roles.map((role, role_index) => {
                                    return {
                                        index: role_index + 1,
                                        role_id: role.role_id,
                                        role: role.name,
                                        status: role.status
                                    };
                                })
                            }
                        });
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                } finally {
                    this.loading = false;
                }
            },
            cleanFilters(){
                this.identification = null
            }
        }
    }
</script>

<style scoped>
    .table-container {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        white-space: nowrap;
    }
</style>
