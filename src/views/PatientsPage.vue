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
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="patient"
                                        density="compact"
                                        label="Patient"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-account-injury"
                                    >    
                                    </v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-select
                                        v-model="gender"
                                        clearable
                                        :items="genders"
                                        item-title="label"
                                        item-value="value"
                                        label="Gender"
                                        variant="outlined"
                                        density="compact"
                                        prepend-inner-icon="mdi-gender-male"
                                        return-object
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" class="d-flex justify-start">
                                    <v-btn
                                        prepend-icon="mdi-account-plus"
                                        color="white"
                                        class="me-2"
                                        ref="modalBtn"
                                        @click="isModalOpen = true"
                                    >
                                        New Patient
                                    </v-btn>

                                    <v-dialog v-model="isModalOpen" max-width="600px">
                                        <PatientModal :isModalOpen="isModalOpen" @close="isModalOpen = false" @save="saveNewPatient" :state="state" :genders="genders"/>
                                    </v-dialog>
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
                            width="4000 px"
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-left">{{ item.patient }}</td>
                                    <td class="text-left">{{ item.identification }}</td>
                                    <td class="text-right">{{ item.age }}</td>
                                    <td class="text-right">{{ item.weight }}</td>
                                    <td class="text-right">{{ item.height }}</td>
                                    <td class="text-left">{{ item.gender }}</td>
                                    <td class="text-left">{{ item.phone }}</td>
                                    <td class="text-left">{{ item.direction }}</td>
                                    <td class="text-left">{{ item.email }}</td>
                                    <td class="text-left">{{ item.disease }}</td>
                                    <td class="text-center">
                                        <v-menu>
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    v-bind="props"
                                                    density="compact"
                                                    icon="mdi-menu"
                                                    variant="solo"
                                                >
                                                </v-btn>
                                            </template>
                                      
                                            <v-list>
                                                <v-list-item>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-text-box-edit"
                                                            variant="solo"
                                                            @click="isModalOpen = true; state = 'edit'"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Edit Information</v-tooltip>
                                                        <v-dialog v-model="isModalOpen" max-width="600px">
                                                            <PatientModal :isModalOpen="isModalOpen" @close="isModalOpen = false" @save="saveNewPatient" :state="state" :genders="genders" :record="item"/>
                                                        </v-dialog>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-receipt-text-arrow-right"
                                                            variant="solo"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Generate Recipe</v-tooltip>
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </td>
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
    import PatientModal from '../components/PatientModal.vue';
    import { jwtDecode } from 'jwt-decode';
    import { patientsService } from "../services/patientsService";

    export default {
        name: 'PatientsPage',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            PatientModal
        },
        data: () => ({
            userInfo: null,
            isModalOpen: false,
            state: "new",
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
                {title: "Patient", key: "patient", align: 'center', width: '500px', sortable: false},
                {title: "Identification", key: 'identification', align: 'center', width: '200px', sortable: false},
                {title: "Age", key: 'age', align: 'center', width: '100px', sortable: false},
                {title: "Weight (Kg)", key: 'weight', align: 'center', width: '150px', sortable: false},
                {title: "Height (m)", key: 'height', align: 'center', width: '150px', sortable: false},
                {title: "Gender", key: 'gender', align: 'center', width: '150px', sortable: false},
                {title: "Phone Number", key: 'phone', align: 'center', width: '200px', sortable: false},
                {title: "Direction", key: 'direction', align: 'center', width: '300px', sortable: false},
                {title: "E-Mail", key: 'email', align: 'center', width: '200px', sortable: false},
                {title: "Disease", key: 'disease', align: 'center', width: '300px', sortable: false},
                {title: "", key: 'actions', align: 'center', width: '150px', sortable: false}
            ],
            genders: [
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
            ],
            gender: null,
            patient: null,
            identification: null,
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
            },
            cleanFilters(){
                this.patient = null
                this.gender = null
                this.identification = null
            },
            closeModal() {
                this.isModalOpen = false;
            },
            saveNewPatient(patientData) {
                if(patientData.patient != null){
                    const patient = patientData.patient
                    if(patient.status == "new"){
                        this.patients.push({
                            patient_id: patient.patient_id,
                            name: patient.name,
                            lastname: patient.lastname,
                            patient: patient.name + " " + patient.lastname,
                            identification: patient.identification,
                            age: patient.age,
                            weight: patient.weight,
                            height: patient.height,
                            gender: patient.gender != null ? patient.gender.label:null,
                            phone: patient.phone,
                            direction: patient.direction,
                            email: patient.email,
                            disease: patient.disease
                        });
                    }else{
                        const found_patient = this.patients.find(p => p.identification === patient.identification);

                        if (found_patient) {
                            found_patient.patient_id = patient.patient_id,
                            found_patient.name = patient.name,
                            found_patient.lastname = patient.lastname,
                            found_patient.patient = patient.name + " " + patient.lastname,
                            found_patient.identification = patient.identification,
                            found_patient.age = patient.age,
                            found_patient.weight = patient.weight,
                            found_patient.height = patient.height,
                            found_patient.gender = patient.gender != null ? patient.gender.label:null,
                            found_patient.phone = patient.phone,
                            found_patient.direction = patient.direction,
                            found_patient.email = patient.email,
                            found_patient.disease = patient.disease
                        }
                    }
                    
                    this.closeModal();
                }
            },
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
