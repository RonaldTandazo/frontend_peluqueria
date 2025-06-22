<template>
    <v-app>
        <ToolBar></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Listado de Clientes</h2>
                </v-col>
            </v-row>
            <v-row>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel title="Filtros de Búsqueda">
                        <v-expansion-panel-text>
                            <v-row cols="12">
                                <v-col cols="3">
                                    <v-text-field
                                        v-model="identificacion"
                                        density="compact"
                                        label="Identificación"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-card-account-details"
                                        maxlength="10"
                                        type="number"
                                    >    
                                    </v-text-field>
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        v-model="cliente"
                                        density="compact"
                                        label="Nombre de cliente"
                                        clearable
                                        variant="outlined"
                                        prepend-inner-icon="mdi-account"
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
                                        @click="isModalOpen = true; state='new'"
                                    >
                                        Nuevo Cliente
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
                                        Limpiar Filtros
                                    </v-btn>
                                    <v-btn
                                        prepend-icon="mdi-cloud-search"
                                        color="blue-accent-2"
                                        @click="getClientes({page: 1, itemsPerPage})"
                                    >
                                        Buscar
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
                <v-card class="pa-md-3 elevation-1" width="100%">
                    <div class="table-container">
                        <v-data-table-server
                            v-model:items-per-page="itemsPerPage"
                            :headers="columns"
                            :items="clientes"
                            :items-length="totalItems"
                            :loading="loading"
                            loading-text="Cargando registros...Por favor espere"
                            :search="search"
                            item-value="id_cliente"
                            @update:options="getClientes"
                            fixed-header
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td class="text-center">{{ item.index }}</td>
                                    <td class="text-left">{{ item.cliente }}</td>
                                    <td class="text-left">{{ item.identificacion }}</td>
                                    <td class="text-left">{{ item.telefono }}</td>
                                    <td class="text-left">{{ item.direccion }}</td>
                                    <td class="text-left">{{ item.email }}</td>
                                    <td class="text-center">
                                        <v-menu>
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
                                                        >
                                                            Editar Información
                                                        </v-tooltip>
                                                    </v-list-item-title>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-list-item-title>
                                                        <v-btn
                                                            density="compact"
                                                            icon="mdi-account-off"
                                                            variant="solo"
                                                            @click="openDialog(item)" 
                                                        >
                                                        </v-btn>
                                                        <v-tooltip
                                                            activator="parent"
                                                            location="top"
                                                        >
                                                            Eliminar Cliente
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
            <ClientesModal v-model="isModalOpen" @close="isModalOpen = false" @save="saveCliente" :state="state" :record="record"/>
        </v-dialog>
        <v-dialog v-model="dialogInactivate" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Está seguro en querer eliminar a este cliente?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteCliente">Sí</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <NotificationAlert :info="notificationMessage" v-if="showNotification" />
    </v-app>
</template>

<script>
    import ToolBar from '../../components/General/ToolBar.vue';
    import ClientesModal from '../../components/Clientes/ClientesModal.vue';
    import NotificationAlert from '../../components/General/NotificationAlert.vue';
    import { ClientesService } from "../../services/Clientes/ClientesService";
    import { mapGetters } from 'vuex';
    
    export default {
        name: 'ClientesView',
        components: {
            ToolBar,
            ClientesModal,
            NotificationAlert
        },
        data: () => ({
            dialogInactivate: false,
            userInfo: null,
            record: null,
            state: 'new',
            isModalOpen: false,
            itemsPerPage: 5,
            columns: [
                {title: "#", key: "index", align: 'center', sortable: false, width:"100px"},
                {title: "Cliente", key: "cliente", align: 'center', sortable: false, width:"400px"},
                {title: "Identificación", key: 'identificacion', align: 'center', sortable: false, width:"200px"},
                {title: "Teléfono", key: 'telefono', align: 'center', sortable: false, width:"150px"},
                {title: "Dirección", key: 'direccion', align: 'center', sortable: false, width:"200px"},
                {title: "E-Mail", key: 'email', align: 'center', sortable: false, width:"200px"},
                {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"125px"}
            ],
            cliente: null,
            identificacion: null,
            loading: false,
            clientes: [],
            totalItems: 0,
            search: '',
            showNotification: false,
            notificationMessage: {},
            item: null
        }),

        watch: {
            dialogInactivate (val) {
                val || this.closeDialog()
            },
        },

        computed: {
            ...mapGetters('auth', ['getUserData']),
        },

        mounted() {
            this.userInfo = this.getUserData
            this.getClientes({ page: 1, itemsPerPage: this.itemsPerPage });
        },
        
        methods: {
            async getClientes({ page, itemsPerPage }){
                try {
                    this.loading = true;
                    const search = {
                        identificacion: this.identificacion,
                        cliente: this.cliente,
                        id_usuario: this.userInfo.id_usuario
                    }

                    const response = await ClientesService.getClientes(search, page - 1, itemsPerPage);
                    if (response.ok){ 
                        this.totalItems = response.data.total;
                        this.clientes = response.data.clientes.map((cliente, index) => ({
                            index: index + 1,
                            cliente: cliente.nombre + ' ' + cliente.apellido,
                            ...cliente
                        }));
                    }
                } catch (error) {
                    this.$emit('notify', {message: error.message, ok: false, show: true});
                } finally {
                    this.loading = false;
                } 
            },
            cleanFilters(){
                this.cliente = null
                this.identificacion = null
            },
            closeModal() {
                this.isModalOpen = false;
            },
            async saveCliente(data) {
                try{
                    this.loading = true;
                    if(data.cliente != null){
                        const cliente = data.cliente
                        let response = null
                        const found_cliente = this.clientes.find(c => c.id_cliente === cliente.id_cliente);

                        if(data.state == "new"){
                            if(found_cliente){
                                return null
                            }

                            response = await ClientesService.store(cliente, this.userInfo.id_usuario)
                            if (response.ok){
                                const new_cliente = response.data
                                this.clientes.push({
                                    index: this.clientes.length + 1,
                                    id_cliente: new_cliente.id_cliente,
                                    cliente: new_cliente.nombre + ' ' + new_cliente.apellido,
                                    nombre: new_cliente.nombre,
                                    apellido: new_cliente.apellido,
                                    identificacion: new_cliente.identificacion,
                                    telefono: new_cliente.telefono,
                                    direccion: new_cliente.direccion,
                                    email: new_cliente.email
                                });
                                this.totalItems += 1
                            }
                        }else if(data.state == 'edit'){
                            if (found_cliente) {
                                response = await ClientesService.update(found_cliente.id_cliente, cliente)
                                if(response.ok){
                                    found_cliente.id_cliente = cliente.id_cliente,
                                    found_cliente.cliente = cliente.nombre + ' ' + cliente.apellido,
                                    found_cliente.nombre = cliente.nombre,
                                    found_cliente.apellido = cliente.apellido,
                                    found_cliente.identificacion = cliente.identificacion,
                                    found_cliente.telefono = cliente.telefono,
                                    found_cliente.direccion = cliente.direccion,
                                    found_cliente.email = cliente.email,
                                    found_cliente.id_usuario = this.userInfo.id_usuario
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
            async deleteCliente() {
                this.loading = true
                this.closeDialog()
                try{
                    const response = await ClientesService.delete(this.item.id_cliente)
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
                    this.getClientes({page: 1, itemsPerPage: this.itemsPerPage})
                    this.triggerNotification()
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