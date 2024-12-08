<template>
    <v-app>
        <ToolBar pageTitle="Medications List"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Medications List</h2>
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
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="medication"
                                        density="compact"
                                        label="Medication"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-pill"
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
                                    >
                                        New Medication
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
                                        @click="getMedications({page: 1, itemsPerPage})"
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
                <v-card class="pa-md-3 elevation-1 bordered-table" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="medications"
                            :items-length="totalItems"
                            item-value="value"
                            :loading="loading"
                            loading-text="Loading Records...Please wait"
                            fixed-header
                            show-expand
                        >
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <div class="d-flex flex-row">
                                            <v-tabs v-model="selectedLab" color="primary" direction="vertical" style="padding-top:15px;">
                                                <v-tab
                                                    v-for="(lab) in item.laboratories"
                                                    :key="lab.laboratory_id"
                                                    :value="lab.laboratory_id"
                                                    prepend-icon="mdi-chemical-weapon"
                                                    :text="lab.laboratory"
                                                >
                                                </v-tab>
                                            </v-tabs>

                                            <v-tabs-window v-model="selectedLab" class="flex-grow-1">
                                                <v-tabs-window-item
                                                    v-for="(lab) in item.laboratories"
                                                    :key="lab.laboratory_id"
                                                    :value="lab.laboratory_id"
                                                >
                                                    <v-card style="padding: 0px 20px;">
                                                        <v-data-table-virtual
                                                            :headers="nestedColumns"
                                                            :items="lab.content"
                                                            item-value="value"
                                                            fixed-header
                                                        >
                                                        </v-data-table-virtual>
                                                    </v-card>
                                                </v-tabs-window-item>
                                            </v-tabs-window>
                                        </div>
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
    import ToolBar from '../../components/General/ToolBar.vue';
    import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
    import { medicationService } from '@/services/medicationService';

    export default {
        name: 'MedicationsList',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
        },
        data: () => ({
            record: null,
            selectedLab: 0,
            medication: null,
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
                    title: 'Medications Dashboard',
                    disabled: false,
                    href: '/medications'
                },
                {
                    title: 'Medications List',
                    disabled: true,
                    href: '/medications/list'
                }
            ],
            columns: [
                {title: '', key: 'data-table-expand' },
                {title: "#", key: 'index', align: 'center', sortable: false, width:"100px"},
                {title: "Medication", key: "medication", align: 'center', sortable: false, width:"300px"},
                {title: "Type", key: 'type', align: 'center', sortable: false, width:"300px"},
                {title: "Diseases", key: 'diseases', align: 'center', sortable: false, width:"600px"}
            ],
            nestedColumns: [
                { title: "#", key: "index", align: "center", sortable: false },
                { title: "Grams", key: "grams", align: "center", sortable: false },
                { title: "Price", key: "price", align: "center", sortable: false },
                { title: "Unit", key: "unit", align: "center", sortable: false },
            ],
            loading: true,
            medications: [],
            totalItems: 0,
            search: '',
        }),

        mounted() {
            this.getMedications({ page: 1, itemsPerPage: this.itemsPerPage });
        },

        methods: {
            async getMedications({ page, itemsPerPage }){
                try {
                    this.loading = true
                    const search = {
                        medication: this.medication,
                    }

                    const response = await medicationService.getMedications(search, page - 1, itemsPerPage);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.totalItems = response.data.pagination.totalElements;
                        this.medications = response.data.medications.map((medication, index) => {
                            return {
                                index: index + 1,
                                value: medication.medication_id,
                                medication: medication.medication,
                                type: medication.type,
                                diseases: medication.diseases.join(', '),
                                laboratories: medication.laboratories.map((laboratory) => {
                                    return{
                                        laboratory_id: laboratory.laboratory_id,
                                        laboratory: laboratory.laboratory,
                                        content: laboratory.content.map((info, index_info) => {
                                            return{
                                                index: index_info + 1,
                                                value: info.medication_laboratory_id,
                                                grams: info.grams,
                                                price: info.price,
                                                unit: info.unit
                                            }
                                        })
                                    }
                                })
                            }
                        });

                        console.log(this.medications)
                    }
                } catch (error) {
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                } finally {
                    this.loading = false;
                }
            },
            cleanFilters(){
                this.medication = null
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
