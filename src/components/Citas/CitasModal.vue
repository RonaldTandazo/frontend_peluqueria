<template>
    <v-dialog :value="internalModalOpen" max-width="50%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="saveCita">
            <v-card
                prepend-icon="mdi-calendar-cursor"
                :title="state == 'new' ? 'Nueva Cita':'Editar Cita'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="data.id_cliente"
                                :error-messages="v$.id_cliente.$errors.map(e => e.$message)"
                                clearable
                                :items="clientes"
                                item-title="label"
                                item-value="value"
                                label="Cliente"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-account"
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.fecha"
                                :error-messages="v$.fecha.$errors.map(e => e.$message)"
                                label="Fecha"
                                prepend-inner-icon="mdi-calendar-range"
                                density="compact"
                                variant="outlined"
                                type="date"
                                clearable
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <h2>Hora:</h2>
                            <v-time-picker
                                v-model="data.hora"
                                :error-messages="v$.hora.$errors.map(e => e.$message)"
                                :max="end"
                                format="24hr"
                                required
                            ></v-time-picker>
                        </v-col>
                        <v-col cols="6" v-if="state == 'edit'">
                            <v-select
                                v-model="data.estado"
                                :error-messages="v$.estado.$errors.map(e => e.$message)"
                                clearable
                                :items="estados"
                                item-title="label"
                                item-value="value"
                                label="Estado"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-account"
                                required
                            ></v-select>
                        </v-col>
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
                        :disabled="v$.$invalid"
                        prepend-icon="mdi-content-save"
                        type="submit"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </form>
    </v-dialog>
</template>

<script setup>
    import { reactive, watch } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { required } from '@vuelidate/validators';
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        isModalOpen: {
            type: Boolean,
            required: true,
        },
        clientes: {
            type: Array,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        record: {
            type: Object,
            required: false
        }   
    });

    const internalModalOpen = reactive({ value: props.isModalOpen });

    const cita = props.state == "new" ? {
        id_cliente: null,
        fecha: null,
        hora: null,
        estado: 'Agendada'
    }:{
        ...props.record,
    }

    const data = reactive({
        ...cita
    })

    const estados = [
        { label: 'En Proceso', value: 'En Proceso' },
        { label: 'Completada', value: 'Completada' },
        { label: 'No asistió', value: 'No asistió' }
    ];
    
    const emit = defineEmits(['save', 'close']);

    const rules = {
        id_cliente: { required },
        fecha: { required },
        hora: { required },
        estado: { required: props.state == 'edit' ? true:false }
    };

    const v$ = useVuelidate(rules, data);
    
    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    function saveCita() {
        if (v$.value.$invalid) return;

        const save = {cita: data, state: props.state}
        emit('save', save);
        closeModal()
    }

    function closeModal() {
        emit('close');
    }
</script>
