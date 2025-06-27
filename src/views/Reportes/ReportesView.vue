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
                        @click="getDataReporte({page: 1, itemsPerPage})"
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
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="data"
                            :items-length="totalItems"
                            :loading="loading"
                            loading-text="Cargando registros...Por favor espere"
                            item-value="index"
                            @update:options="getDataReporte"
                            fixed-header
                            no-data-text="No hay información para mostrar"
                        >
                        </v-data-table-server>
                    </div>
                </v-card>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import { ReportesService } from '@/services/Reportes/ReportesService';
    import ToolBar from '../../components/General/ToolBar.vue';

    export default {
        name: 'ReportesView',
        components: {
            ToolBar
        },
        data: () => ({
            itemsPerPage: 5,
            columns: [],
            totalItems: 0,
            reporte: null,
            data: null,
            loading: false,
            options: [
                { label: 'Clientes por Cita', value: 'Clientes por Cita' },
                { label: 'Clientes, Citas y Servicios', value: 'Clientes, Citas y Servicios' },
                { label: 'Valores por Cliente', value: 'Valores por Cliente' },
                { label: 'Citas y Servicios', value: 'Citas y Servicios' }
            ]
        }),

        methods: {
            async getDataReporte({ page, itemsPerPage }){
                try {
                    this.loading = true;
                    const response = await ReportesService.getDataReporte(this.reporte, page - 1, itemsPerPage);
                    if (response.ok){
                        if(response.data.data.length > 0){
                            this.totalItems = response.data.total;
                            this.columns = response.data.columns
                            this.data = response.data.data.map((item, index) => ({
                                index: index + 1,
                                ...item
                            }))
                        }
                    }
                } catch (error) {
                    this.$emit('notify', {message: error.message, ok: false, show: true});
                } finally {
                    this.loading = false;
                }
            }
        }
    };
</script>