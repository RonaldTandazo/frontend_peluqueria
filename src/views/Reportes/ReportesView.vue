<template>
    <v-app>
        <ToolBar pageTitle="Reportes"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Reportes</h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-select
                        v-model="reporte"
                        clearable
                        :items="options"
                        item-title="label"
                        item-value="value"
                        label="Tipo Reporte"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-account"
                        required
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                        prepend-icon="mdi-cloud-search"
                        color="blue-accent-2"
                        @click="getDataReporte()"
                        :disabled="reporte ? false:true"
                    >
                        Buscar
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row v-if="data">
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            :headers="columns"
                            :items="data"
                            :loading="loading"
                            loading-text="Cargando registros...Por favor espere"
                            item-value="index"
                            @update:options="getDataReporte"
                            fixed-header
                            :show-expand="reporte != 'Clientes por Cita'"
                        >
                            <template v-slot:expanded-row="{ columns, item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <div class="d-flex justify-center" v-if="reporte != 'Clientes por Cita' && reporte != 'Servicios por Cita'">
                                            <v-tabs v-model="selectedCita" color="primary" direction="vertical" style="padding-top:15px;">
                                                <v-tab
                                                    v-for="(cita) in item.citas"
                                                    :key="cita.id_cita"
                                                    :value="cita.id_cita"
                                                    prepend-icon="mdi-chemical-weapon"
                                                    :text="'Cita:' + cita.fecha + ' ' + cita.hora"
                                                >
                                                </v-tab>
                                            </v-tabs>

                                            <v-tabs-window v-model="selectedCita" class="flex-grow-1">
                                                <v-tabs-window-item
                                                    v-for="(cita) in item.citas"
                                                    :key="cita.id_cita"
                                                    :value="cita.id_cita"
                                                >
                                                    <v-card style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px;">
                                                        <div style="display: flex; flex-flow: row; justify-content: space-evenly;">
                                                            <div>
                                                                Costo Total de la cita: <v-chip prepend-icon="mdi-cash" color="green">${{ cita.costo }}</v-chip>
                                                            </div>
                                                            <div>
                                                                Total de Servicios Realizados: <v-chip prepend-icon="mdi-check-circle" color="primary">{{ cita.atenciones.length }}</v-chip>
                                                            </div>
                                                        </div>
                                                        <v-data-table-virtual
                                                            :headers="nestedColumns"
                                                            :items="cita.atenciones"
                                                            item-value="id_servicio"
                                                            fixed-header
                                                        >
                                                        </v-data-table-virtual>
                                                    </v-card>
                                                </v-tabs-window-item>
                                            </v-tabs-window>
                                        </div>
                                        <v-card style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px;" v-if="reporte == 'Servicios por Cita'">
                                            <v-data-table-virtual
                                                :headers="nestedColumns"
                                                :items="item.atenciones"
                                                item-value="medication_laboratory_id"
                                                fixed-header
                                            >
                                            </v-data-table-virtual>
                                        </v-card>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table-server>
                    </div>
                </v-card>
            </v-row>
        </v-container>
        <NotificationAlert :info="notificationMessage" v-if="showNotification" />
    </v-app>
</template>

<script>
    import { ReportesService } from '@/services/Reportes/ReportesService';
    import ToolBar from '../../components/General/ToolBar.vue';
    import NotificationAlert from '../../components/General/NotificationAlert.vue';

    export default {
        name: 'ReportesView',
        components: {
            ToolBar,
            NotificationAlert
        },
        data: () => ({
            columns: [],
            nestedColumns: [],
            selectedCita: 0,
            reporte: null,
            data: null,
            loading: false,
            options: [
                { label: 'Clientes por Cita', value: 'Clientes por Cita' },
                { label: 'Clientes, Citas y Servicios', value: 'Clientes, Citas y Servicios' },
                { label: 'Valores por citas de clientes', value: 'Valores por citas de clientes' },
                { label: 'Servicios por Cita', value: 'Servicios por Cita' }
            ],
            showNotification: false,
            notificationMessage: {}
        }),

        methods: {
            async getDataReporte(){
                try {
                    this.loading = true;
                    const response = await ReportesService.getDataReporte(this.reporte);
                    if (response.ok){
                        if(response.data.info.length > 0){
                            this.columns = response.data.columns
                            this.nestedColumns = response.data.nestedColumns
                            this.data = response.data.info.map((item, index) => ({
                                index: index + 1,
                                ...item
                            }))
                        }
                    }
                } catch (error) {
                    this.data = null;
                    this.notificationMessage = {
                        message:error.message, 
                        ok:false, 
                        show: true
                    }
                } finally {
                    this.loading = false;
                    if(this.notificationMessage.show){
                        this.triggerNotification()
                    }
                }
            },

            triggerNotification() {
                this.showNotification = true;
                setTimeout(() => {
                    this.showNotification = false;
                }, 3000);
            },
        }
    };
</script>