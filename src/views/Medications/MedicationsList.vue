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
                <v-card class="pa-md-3 elevation-1">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="medications"
                            :items-length="totalItems"
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
                                                    :key="lab.value"
                                                    :value="lab.value"
                                                    prepend-icon="mdi-chemical-weapon"
                                                    :text="lab.labName"
                                                >
                                                </v-tab>
                                            </v-tabs>
        
                                            <v-tabs-window v-model="selectedLab" class="flex-grow-1">
                                                <v-tabs-window-item
                                                    v-for="(lab) in item.laboratories"
                                                    :key="lab.value"
                                                    :value="lab.value"
                                                >
                                                    <v-card style="padding: 0px 20px;">
                                                        <v-data-table-virtual
                                                            :headers="nestedColumns"
                                                            :items="lab.gramajes"
                                                            item-value="gramaje"
                                                            fixed-header
                                                        ></v-data-table-virtual>
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

    export default {
        name: 'MedicationsList',
        components: {
            ToolBar,
            AdaptativeBreadcrumbs,
        },
        data: () => ({
            record: null,
            selectedLab: 0,
            expanded: [],

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
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Medication", key: "medication", align: 'center', sortable: false, width:"300px"},
                {title: "Description", key: 'description', align: 'center', sortable: false, width:"300px"},
                {title: "Diseases", key: 'diseases', align: 'center', sortable: false, width:"600px"}
            ],
            nestedColumns: [
                { title: "#", key: "index", align: "center", sortable: false },
                { title: "Gramaje", key: "gramaje", align: "center", sortable: false },
                { title: "Precio", key: "precio", align: "center", sortable: false },
            ],
            loading: false,
            medications: [
                {
                    index: 1,
                    medication: "Paracetamol",
                    description: "Analgesic",
                    diseases: "eje,eje,eje",
                    laboratories: [
                        {
                            value: 1,
                            labName: "Pfizer",
                            gramajes: [
                                { index: 1, gramaje: "500mg", precio: "$1.10" },
                                { index: 2, gramaje: "1000mg", precio: "$1.60" }
                            ],
                        },
                        {
                            value: 2,
                            labName: "Aztraceneca",
                            gramajes: [
                                { index: 1, gramaje: "500mg", precio: "$1.10" },
                                { index: 2, gramaje: "1000mg", precio: "$1.60" },
                            ],
                        },
                    ],
                },
            ],
            totalItems: 0,
            search: '',
        }),

        mounted() {
        },

        methods: {
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
