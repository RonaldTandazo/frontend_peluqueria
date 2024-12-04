<template>
    <v-app>
        <ToolBar pageTitle="Patients List"></ToolBar>
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
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        New Patient
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
                                        @click="getDoctorPatients({page: 1, itemsPerPage})"
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
                <v-card class="pa-md-3 elevation-1">
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
                            fixed-header
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-left">{{ item.index }}</td>
                                    <td class="text-left">{{ item.name + " "+ item.lastname }}</td>
                                    <td class="text-left">{{ item.identification }}</td>
                                    <td class="text-right">{{ item.age }}</td>
                                    <td class="text-right">{{ item.weight }}</td>
                                    <td class="text-right">{{ item.height }}</td>
                                    <td class="text-left">{{ item.gender == 'M' ? 'Male':(item.gender == 'F' ? 'Female':null) }}</td>
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
                                                            @click="isModalOpen = true; state = 'edit'; record=item"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >Edit Information</v-tooltip>
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
        <v-dialog v-model="isModalOpen" max-width="600px">
            <PatientModal v-model="isModalOpen" @close="isModalOpen = false" @save="saveNewPatient" :state="state" :genders="genders" :record="record"/>
        </v-dialog>
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import PatientModal from '../../components/Patients/PatientModal.vue';
    import { patientsService } from "../../services/patientsService";
    import { mapGetters } from 'vuex';

    export default {
        name: 'PatientsList',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
            PatientModal
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
                    title: 'Patients Dashboard',
                    disabled: false,
                    href: '/patients'
                },
                {
                    title: 'Patients List',
                    disabled: true,
                    href: '/patients/list'
                }
            ],
            columns: [
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Patient", key: "patient", align: 'center', sortable: false, width:"400px"},
                {title: "Identification", key: 'identification', align: 'center', sortable: false, width:"200px"},
                {title: "Age", key: 'age', align: 'center', sortable: false, width:"125px"},
                {title: "Weight (Kg)", key: 'weight', align: 'center', sortable: false, width:"125px"},
                {title: "Height (m)", key: 'height', align: 'center', sortable: false, width:"125px"},
                {title: "Gender", key: 'gender', align: 'center', sortable: false, width:"125px"},
                {title: "Phone Number", key: 'phone', align: 'center', sortable: false, width:"150px"},
                {title: "Direction", key: 'direction', align: 'center', sortable: false, width:"200px"},
                {title: "E-Mail", key: 'email', align: 'center', sortable: false, width:"200px"},
                {title: "Disease", key: 'disease', align: 'center', sortable: false, width:"200px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
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

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData,
            this.getDoctorPatients({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getDoctorPatients({ page, itemsPerPage }){
                try {
                    const search = {
                        identification: this.identification,
                        patient: this.patient,
                        gender: this.gender,
                        doctor_id: this.userInfo.user_id
                    }
                    const response = await patientsService.getPatientsByDoctorId(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.totalElements;
                        this.patients = response.data.content.map((patient, index) => ({
                            index: index + 1,
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
            async saveNewPatient(patientData) {
                try{
                    if(patientData != null){
                        const patient = patientData
                        patient.doctorId = this.userInfo.user_id
                        if(patient.status == "new"){
                            const found_patient = this.patients.find(p => p.identification === patient.identification);
                            if(found_patient){
                                return null
                            }
                            this.patients.push({
                                patient_id: patient.patient_id,
                                name: patient.name,
                                lastname: patient.lastname,
                                identification: patient.identification,
                                age: patient.age,
                                weight: patient.weight,
                                height: patient.height,
                                gender: patient.gender,
                                phone: patient.phone,
                                direction: patient.direction,
                                email: patient.email,
                                disease: patient.disease,
                            });
                            this.totalItems += 1 
                            
                            await patientsService.store(patient)
                        }else{
                            const found_patient = this.patients.find(p => p.identification === patient.identification);

                            if (found_patient) {
                                found_patient.patient_id = patient.patient_id,
                                found_patient.name = patient.name,
                                found_patient.lastname = patient.lastname,
                                found_patient.identification = patient.identification,
                                found_patient.age = patient.age,
                                found_patient.weight = patient.weight,
                                found_patient.height = patient.height,
                                found_patient.gender = patient.gender,
                                found_patient.phone = patient.phone,
                                found_patient.direction = patient.direction,
                                found_patient.email = patient.email,
                                found_patient.disease = patient.disease,
                                found_patient.doctorId = this.userInfo.user_id
                            }
                            await patientsService.update(found_patient.patient_id, found_patient)
                        }
                    }
                }catch (error) {
                    console.log(error)
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
