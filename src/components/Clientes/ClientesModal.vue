<template>
    <v-dialog :value="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="saveCliente">
            <v-card
                prepend-icon="mdi-account"
                :title="state == 'new' ? 'Nuevo Cliente':'Editar Información'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.nombre"
                                :error-messages="v$.nombre.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Nombres"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-n-box"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.apellido"
                                :error-messages="v$.apellido.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Apellido"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-l-box"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.identificacion"
                                :error-messages="v$.identificacion.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Identificación"
                                variant="outlined"
                                prepend-inner-icon="mdi-card-account-details"
                                required
                                type="number"
                                maxlength="10"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.telefono"
                                :error-messages="v$.telefono.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-phone"
                                label="Phone Number"
                                variant="outlined"
                                density="compact"
                                required
                                type="number"
                                maxlength="10"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.direccion"
                                :error-messages="v$.direccion.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-map-marker"
                                label="Dirección"
                                variant="outlined"
                                density="compact"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.email"
                                :error-messages="v$.email.$errors.map(e => e.$message)"
                                clearable
                                prepend-inner-icon="mdi-email"
                                label="E-Mail"
                                variant="outlined"
                                density="compact"
                                required
                                @input="v$.email.$touch"
                            ></v-text-field>
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
    import { email, required } from '@vuelidate/validators';
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        isModalOpen: {
            type: Boolean,
            required: true,
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

    const cliente = props.state == "new" ? {
        nombre: null,
        apellido: null,
        identificacion: null,
        telefono: null,
        direccion: null,
        email: null,
        estado: 'Agendada'
    }:props.record

    const data = reactive({
        ...cliente,
    })

    const emit = defineEmits(['save', 'close']);

    const rules = {
        nombre: { required },
        apellido: { required },
        identificacion: { required },
        telefono: { required },
        direccion: { required },
        email: { required, email }
    };

    const v$ = useVuelidate(rules, data);

    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    function saveCliente() {
        if (v$.value.$invalid) return;

        const save = {cliente: data, state: props.state}
        emit('save', save);
        closeModal()
    }

    function closeModal() {
        emit('close');
    }
</script>
