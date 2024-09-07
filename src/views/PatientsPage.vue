<template>
    <v-app>
        <ToolBar pageTitle="Patients Dashboard"></ToolBar>
        <!-- <v-main> -->
            <v-container>
                <v-row>
                    <v-col cols="12" class="d-flex justify-start">
                        <h2 class="text-h4">Patients List</h2>
                    </v-col>
                </v-row>
                <v-row>
                    <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
                </v-row>
                <v-row>
                    <v-card class="pa-md-6 elevation-1" style="width: 100%;">
                        dfsdf
                    </v-card>
                </v-row>
                <v-row class="py-md-5">
                    <v-divider></v-divider>
                </v-row>
                <v-row>
                    <v-card class="pa-md-3 elevation-1" style="width: 100%;">
                        <v-table
                            height="300px"
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th 
                                        class="text-left"
                                        v-for="column in columns"
                                        :key="column"
                                    >
                                    {{ column }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="patient in patients"
                                    :key="patient.id"
                                >
                                    <td class="text-left">{{ patient.nombre+" "+patient.apellido  }}</td>
                                    <td class="text-right">{{ patient.identification  }}</td>
                                    <td class="text-right">{{ patient.age }}</td>
                                    <td class="text-right">{{ patient.weight }}</td>
                                    <td class="text-right">{{ patient.height }}</td>
                                    <td class="text-left">{{ patient.gender }}</td>
                                    <td class="text-left">{{ patient.disease }}</td>
                                    <td class="text-left">{{ patient.direccion }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-row>
            </v-container>
        <!-- </v-main> -->
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
                "Patient",
                "Identification",
                "Age",
                "Weight",
                "Height",
                "Gender",
                "Disease",
                "Direction"
            ],
            patients: null
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
            this.getDoctorPatients()
        },

        methods: {
            async getDoctorPatients(){
                try{    
                    const response = await patientsService.getPatientsByDoctorId(this.userInfo.user_id);
                    if(!response.success){
                        this.$emit('notify', {message:response.message, ok:response.success, show: true});
                    }

                    this.patients = response.data
                    console.log(this.patients)
                }catch(error){
                    this.$emit('notify', {message:"Error While Searching", ok:false, show: true});
                }
            }
        }
    }
</script>
