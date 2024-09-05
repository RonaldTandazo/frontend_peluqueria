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
                                v-for="item in desserts"
                                :key="item.name"
                            >
                                <td>{{ item.name }}</td>
                                <td>{{ item.calories }}</td>
                            </tr>
                        </tbody>
                    </v-table>
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
                "Name",
                "Age",
                "Weight",
                "Height",
                "Gender",
                "Disease"
            ],
            patients: null
        }),

        mounted() {
            this.getDoctorPatients()
        },

        methods: {
            getDoctorPatients(){
                try{
                    const token = localStorage.getItem('jwt');
                    if(token){
                        this.userInfo = jwtDecode(token);
                    }
    
                    const data = {
                        user_id: this.userInfo.user_id,
                        username: this.userInfo.username,
                        email: this.userInfo.email,
                        identification: this.userInfo.identification,
                        gender: this.userInfo.gender,
                        age: this.userInfo.age,
                        phonenumber: this.userInfo.phonenumber,
                        avatar: this.userInfo.avatarUrl
                    }
                    const response = patientsService.getPatientsByDoctorId(data);
                    console.log(response)
                }catch(error){
                    console.log(error)
                }
            }
        }
    }
</script>
