<template>
    <v-app>
        <ToolBar pageTitle="Patients Dashboard"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Patients List</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row>
                <v-card class="pa-md-3 elevation-1" style="width: 100%;">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="patients"
                            :items-length="totalItems"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            :search="search"
                            item-value="patient"
                            @update:options="getDoctorPatients"
                            fixed-header="true"
                            width="4000px"
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-left">{{ item.patient }}</td>
                                    <td class="text-left">{{ item.identification }}</td>
                                    <td class="text-right">{{ item.age }}</td>
                                    <td class="text-right">{{ item.weight }}</td>
                                    <td class="text-right">{{ item.height }}</td>
                                    <td class="text-left">{{ item.gender }}</td>
                                    <td class="text-left">{{ item.disease }}</td>
                                    <td class="text-left">{{ item.direction }}</td>
                                </tr>
                            </template>
                        </v-data-table-server>

                    </div>
                </v-card>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import ToolBar from '../components/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../components/AdaptativeBreadcrumbs.vue';
    import { jwtDecode } from 'jwt-decode';
    import { patientsService } from "../services/patientsService";

    export default {
        name: 'PatientsPage',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
        },
        data: () => ({
            userInfo: null,
            itemsPerPage: 5,
            routes: [
                {
                    title: 'Home',
                    disabled: false,
                    href: '/home'
                },
                {
                    title: 'Patients Dashboard',
                    disabled: true,
                    href: '/patients'
                }
            ],
            columns: [
                {title: "Patient", key: "patient", align: 'center', width: '200px', sortable: false},
                {title: "Identification", key: 'identification', align: 'center', width: '150px', sortable: false},
                {title: "Age", key: 'age', align: 'center', width: '100px', sortable: false},
                {title: "Weight (Kg)", key: 'weight', align: 'center', width: '120px', sortable: false},
                {title: "Height (m)", key: 'height', align: 'center', width: '120px', sortable: false},
                {title: "Gender", key: 'gender', align: 'center', width: '100px', sortable: false},
                {title: "Disease", key: 'disease', align: 'center', width: '200px', sortable: false},
                {title: "Direction", key: 'direction', align: 'center', width: '200px', sortable: false}
            ],
            loading: true,
            patients: [],
            totalItems: 0,
            search: '',
        }),

        mounted() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    this.userInfo = jwtDecode(token);
                } catch (error) {
                    console.error('Invalid token', error);
                }
            }

            this.getDoctorPatients({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getDoctorPatients({ page, itemsPerPage }){
                try {
                    const response = await patientsService.getPatientsByDoctorId(this.userInfo.user_id, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.totalElements;
                        this.patients = response.data.content.map(patient => ({
                            patient: patient.name + ' ' + patient.lastname,
                            ...patient
                        }));

                        this.loading = false;
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                }
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
