<template>
    <v-dialog :value="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="saveServicio">
            <v-card
                prepend-icon="mdi-list-box"
                title='Servicios Realizados'
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="data.id_servicio"
                                :error-messages="v$.id_servicio.$errors.map(e => e.$message)"
                                clearable
                                :items="servicios"
                                item-title="label"
                                item-value="value"
                                label="Servicio"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-account"
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="6">                            
                            <v-text-field
                                v-model="data.precio"
                                clearable
                                density="compact"
                                variant="outlined"
                                placeholder="Precio"
                                type="number"
                                prepend-inner-icon="mdi-currency-usd"
                                hide-details
                                single-line
                                :min="5"
                                :max="50"
                                :step="0.5"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="py-md-5">
                        <v-divider></v-divider>
                    </v-row>
                    <v-row>
                        <h4>Servicios</h4>
                        <v-card class="pa-md-3 elevation-1" width="100%">
                            <div class="table-container">
                                <v-data-table-server
                                    v-model:items-per-page="itemsPerPage"
                                    :headers="columns"
                                    :items="atenciones"
                                    :items-length="totalItems"
                                    :loading="loading"
                                    loading-text="Cargando registros...Por favor espere"
                                    :search="search"
                                    item-value="id_atencion"
                                    @update:options="getAtencionesByCita"
                                    fixed-header
                                >
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td class="text-center">{{ item.index }}</td>
                                            <td class="text-left">{{ item.servicio }}</td>
                                            <td class="text-left">{{ item.precio }}</td>
                                            <td class="text-left">{{ item.usuario }}</td>
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
                                                                    icon="mdi-playlist-remove"
                                                                    variant="solo"
                                                                    @click="deleteAtencion(item)" 
                                                                >
                                                                </v-btn>
                                                                <v-tooltip
                                                                    activator="parent"
                                                                    location="top"
                                                                >
                                                                    Eliminar Atención
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
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text="Cerrar"
                        variant="plain"
                        @click="closeModal"
                        prepend-icon="mdi-close-circle"
                    ></v-btn>
                    <v-btn
                        color="primary"
                        text="Guardar"
                        variant="tonal"
                        :disabled="v$.$invalid || loading"
                        prepend-icon="mdi-content-save"
                        type="submit"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </form>
    </v-dialog>
</template>

<script setup>
    import { reactive, watch, onMounted, ref } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { required } from '@vuelidate/validators';
    import { defineProps, defineEmits } from 'vue';
    import { AtencionesService } from '../../services/Atenciones/AtencionesService';

    const props = defineProps({
        isModalOpenServicios: {
            type: Boolean,
            required: true,
        },
        servicios: {
            type: Array,
            required: true
        },
        usuario: {
            type: Object,
            required: true
        },
        record: {
            type: Object,
            required: false
        }        
    });

    const emit = defineEmits(['close']);

    const internalModalOpen = reactive({ value: props.isModalOpenServicios });

    const servicio = {
        id_servicio: null,
        precio: null,
        id_cita: props.record.id_cita
    }

    const atenciones = ref([]);
    const loading = ref(false);
    const itemsPerPage = ref(5);
    const totalItems = ref(0);

    const columns = [
        {title: "#", key: "index", align: 'center', sortable: false, width:"50px"},
        {title: "Servicio", key: "servicio", align: 'center', sortable: false, width:"200px"},
        {title: "Precio ($)", key: "precio", align: 'center', sortable: false, width:"200px"},
        {title: "Ingreaso Por", key: "usuario", align: 'center', sortable: false, width:"200px"},
        {title: "Actions", key: 'actions', align: 'center', sortable: false, width:"75px"}
    ];

    const data = reactive({
        ...servicio,
    })

    const rules = {
        id_servicio: { required },
        precio: { required },
        id_cita: { required }
    };

    const v$ = useVuelidate(rules, data);

    watch(() => props.isModalOpenServicios, (val) => {
        internalModalOpen.value = val;
    });

    onMounted(() => {
        getAtencionesByCita({ page: 1, itemsPerPage: 1000 });
    });

    async function saveServicio() {
        if (v$.value.$invalid) return;
        
        try {
            loading.value = true;
            const response = await AtencionesService.store(data, props.usuario.id_usuario);
            if (response.ok){ 
                const new_atencion = response.data;
                const found_servicio = props.servicios.find(serv => serv.value === new_atencion.id_servicio);  
                atenciones.value.push({
                    index: atenciones.value.length + 1,
                    id_atencion: new_atencion.id_atencion,
                    id_servicio: new_atencion.id_servicio,
                    servicio: found_servicio.label,
                    precio: new_atencion.precio,
                    usuario: props.usuario.username,
                });
                totalItems.value += 1;
            }
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false;
        }
    }

    const getAtencionesByCita = async({ page, itemsPerPage }) => {
        try {
            loading.value = true;
            const response = await AtencionesService.getAtencionesByCita(data.id_cita, page - 1, itemsPerPage);
            if (response.ok){ 
                totalItems.value = response.data.total;
                atenciones.value = response.data.atenciones.map((atencion, index) => ({
                    index: index + 1,
                    ...atencion
                }));
            }
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false;
        }
    }

    const deleteAtencion = async (item) => {
        try{
            await AtencionesService.delete(item.id_atencion)
        }catch(error){
            console.log(error)
        }finally{
            loading.value = false
            getAtencionesByCita({page: 1, itemsPerPage: itemsPerPage})
        }
    }

    function closeModal() {
        emit('close');
    }
</script>
