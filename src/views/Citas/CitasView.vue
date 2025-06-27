<template>
    <v-app>
        <ToolBar pageTitle="Agendar Cita"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Agendar Cita</h2>
                </v-col>
            </v-row>
            <v-col cols="6" class="d-flex justify-start">
                <v-btn
                    prepend-icon="mdi-calendar-plus"
                    color="white"
                    class="me-2"
                    ref="modalBtn"
                    @click="isModalOpen = true; state='new'"
                >
                    Nueva Cita
                </v-btn>
            </v-col>
            <v-row class="py-md-5">
                <v-divider></v-divider>
            </v-row>
            <v-row>
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="citas"
                            :items-length="totalItems"
                            :loading="loading"
                            loading-text="Cargando registros...Por favor espere"
                            :search="search"
                            item-value="id_cita"
                            @update:options="getCitas"
                            fixed-header
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-center">{{ item.index }}</td>
                                    <td class="text-left">{{ item.cliente }}</td>
                                    <td class="text-left">{{ item.fecha }}</td>
                                    <td class="text-left">{{ item.hora }}</td>
                                    <td class="text-left">{{ item.estado }}</td>
                                    <td class="text-center">
                                        <v-menu v-if="item.estado == 'Agendada' || item.estado == 'Completada' || item.estado == 'En Proceso'">
                                            <template v-slot:activator="{ props }">
                                                <v-btn
                                                    v-bind="props"
                                                    density="compact"
                                                    icon="mdi-menu"
                                                    variant="solo"
                                                    :disabled="loading"
                                                >
                                                </v-btn>
                                            </template>
                                      
                                            <v-list>
                                                <v-list-item>
                                                    <v-list-item-title v-if="item.estado == 'Agendada' || item.estado == 'En Proceso'">
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
                                                        >
                                                            Editar Cita
                                                        </v-tooltip>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2" v-if="item.estado == 'Agendada' || item.estado == 'En Proceso'"></v-divider>
                                                    <v-list-item-title v-if="item.estado == 'Completada' || item.estado == 'En Proceso'">
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-list-box"
                                                            variant="solo"
                                                            @click="isModalOpenServicios = true; record=item"
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >
                                                            Servicios Realizados
                                                        </v-tooltip>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2" v-if="item.estado == 'Agendada'"></v-divider>
                                                    <v-list-item-title v-if="item.estado == 'Agendada'">
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-calendar-remove"
                                                            variant="solo"
                                                            @click="openDialog(item)" 
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >
                                                            Eliminar Cita
                                                        </v-tooltip>
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
            <CitasModal 
                v-model="isModalOpen" 
                @close="isModalOpen = false" 
                @save="saveCita" 
                :clientes="clientes"
                :state="state" 
                :record="record" 
            />
        </v-dialog>
        <v-dialog v-model="isModalOpenServicios" max-width="600px">
            <AtencionesModal 
                v-model="isModalOpenServicios" 
                @close="isModalOpenServicios = false"
                :servicios="servicios"
                :usuario="this.userInfo"
                :record="record" 
            />
        </v-dialog>
        <v-dialog v-model="dialogInactivate" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Está seguro en querer eliminar esta cita?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteCita">Sí</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <NotificationAlert :info="notificationMessage" v-if="showNotification" />
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import CitasModal from "../../components/Citas/CitasModal.vue";
    import AtencionesModal from "../../components/Atenciones/AtencionesModal.vue";
    import NotificationAlert from '../../components/General/NotificationAlert.vue';
    import { CitasService } from "../../services/Citas/CitasService";
    import { ClientesService } from "../../services/Clientes/ClientesService";
    import { ServiciosService } from "../../services/Servicios/ServiciosService";
    import { mapGetters } from 'vuex';

    export default {
        name: 'CitasView',
        components: {
            ToolBar,
            CitasModal,
            NotificationAlert,
            AtencionesModal
        },
        data: () => ({
            dialogInactivate: false,
            userInfo: null,
            record: null,
            state: 'new',
            isModalOpen: false,
            isModalOpenServicios: false,
            itemsPerPage: 5,
            columns: [
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Cliente", key: "cliente", align: 'center', sortable: false, width:"400px"},
                {title: "Fecha", key: 'fecha', align: 'center', sortable: false, width:"150px"},
                {title: "Hora", key: 'hora', align: 'center', sortable: false, width:"150px"},
                {title: "Estado", key: "estado", align: 'center', sortable: false, width:"200px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
            ],
            loading: false,
            citas: [],
            clientes: [],
            servicios: [],
            totalItems: 0,
            showNotification: false,
            notificationMessage: {},
            item: null
        }),

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData,
            this.getClientes({ page: 1, itemsPerPage: 1000 });
            this.getServicios();
        },

        methods: {
            async getCitas({ page, itemsPerPage }){
                try {
                    this.loading = true;
                    const response = await CitasService.getCitas(page - 1, itemsPerPage);
                    if (response.ok){ 
                        this.totalItems = response.data.total;
                        this.citas = response.data.citas.map((cita, index) => ({
                            index: index + 1,
                            ...cita
                        }));
                    }
                } catch (error) {
                    this.$emit('notify', {message: error.message, ok: false, show: true});
                } finally {
                    this.loading = false;
                } 
            },
            async getClientes({ page, itemsPerPage }){
                try {
                    this.loading = true;
                    const search = {
                        identificacion: 'null',
                        cliente: 'null'
                    }

                    const response = await ClientesService.getClientes(search, page - 1, itemsPerPage);
                    if (response.ok){ 
                        this.clientes = response.data.clientes.map((cliente) => ({
                            value: cliente.id_cliente,
                            label: cliente.nombre + ' ' + cliente.apellido,
                        }));
                    }
                } catch (error) {
                    this.$emit('notify', {message: error.message, ok: false, show: true});
                } finally {
                    this.loading = false;
                } 
            },
            async saveCita(data) {
                try{
                    this.loading = true;
                    if(data.cita != null){
                        const cita = data.cita
                        let response = null
                        const found_cita = this.citas.find(c => c.id_cita === cita.id_cita);
                        const cliente = this.clientes.find(cli => cli.value === cita.id_cliente);

                        if(data.state == "new"){
                            if(found_cita){
                                return null
                            }

                            response = await CitasService.store(cita)
                            if (response.ok){
                                const new_cita = response.data;
                                
                                this.citas.push({
                                    index: this.citas.length + 1,
                                    id_cita: new_cita.id_cita,
                                    id_cliente: new_cita.id_cliente,
                                    cliente: cliente.label,
                                    fecha: new_cita.fecha,
                                    hora: new_cita.hora,
                                    estado: new_cita.estado
                                });
                                this.totalItems += 1
                            }
                        }else if(data.state == 'edit'){
                            if (found_cita) {
                                response = await CitasService.update(found_cita.id_cita, cita)
                                if(response.ok){
                                    found_cita.id_cita = cita.id_cita,
                                    found_cita.id_cliente = cita.id_cliente,
                                    found_cita.cliente = cliente.label,
                                    found_cita.fecha = cita.fecha,
                                    found_cita.hora = cita.hora,
                                    found_cita.estado = cita.estado
                                }
                            }
                        }

                        this.notificationMessage = {
                            message: response.message, 
                            ok: true, 
                            show: true
                        }
                    }
                }catch (error) {
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
            openDialog(item) {
                this.item = item
                this.dialogInactivate = true
            },
            closeDialog() {
                this.dialogInactivate = false
            },
            async deleteCita() {
                this.loading = true
                this.closeDialog()
                try{
                    const response = await CitasService.delete(this.item.id_cita)
                    this.notificationMessage = {
                        message:response.message, 
                        ok:true, 
                        show: true
                    }
                }catch(error){
                    this.notificationMessage = {
                        message:error.message, 
                        ok:false, 
                        show: true
                    }
                }finally{
                    this.loading = false
                    this.getCitas({page: 1, itemsPerPage: this.itemsPerPage})
                    this.triggerNotification()
                }
            },
            async getServicios(){
                try {
                    this.loading = true;

                    const response = await ServiciosService.getServicios();
                    if (response.ok){
                        this.servicios = response.data.map((servicio) => ({
                            value: servicio.id_servicio,
                            label: servicio.descripcion,
                        }));
                    }
                } catch (error) {
                    this.$emit('notify', {message: error.message, ok: false, show: true});
                } finally {
                    this.loading = false;
                } 
            },
        }
    };
</script>