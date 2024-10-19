<template>
    <v-dialog :value="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="saveAppointment">
            <v-card
                prepend-icon="mdi-calendar-cursor"
                :title="state == 'new' ? 'New Appointment':'Edit Appointment'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="12">
                            <v-text-field
                                v-model="data.title"
                                :error-messages="v$.title.$errors.map(e => e.$message)"
                                clearable
                                density="compact"
                                label="Title"
                                variant="outlined"
                                prepend-inner-icon="mdi-format-title"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <v-textarea
                                v-model="data.description"
                                :error-messages="v$.description.$errors.map(e => e.$message)"
                                label="Description"
                                prepend-inner-icon="mdi-text-box"
                                density="compact"
                                variant="outlined"
                                rows="1"
                                clearable
                                counter
                                auto-grow
                                required
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="data.date"
                                :error-messages="v$.date.$errors.map(e => e.$message)"
                                label="Date"
                                prepend-inner-icon="mdi-calendar-range"
                                density="compact"
                                variant="outlined"
                                type="date"
                                clearable
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                v-model="data.importance"
                                :error-messages="v$.importance.$errors.map(e => e.$message)"
                                clearable
                                :items="importance"
                                item-title="label"
                                item-value="value"
                                label="Importance"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-alert-circle"
                                required
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row
                        cols="12"
                        align="center"
                        justify="space-around"
                    >
                        <v-col style="width: 350px; flex: 0 1 auto;">
                            <h2>Start:</h2>
                            <v-time-picker
                                v-model="data.start"
                                :error-messages="v$.start.$errors.map(e => e.$message)"
                                :max="end"
                                format="24hr"
                                required
                            ></v-time-picker>
                        </v-col>
                        <v-col style="width: 350px; flex: 0 1 auto;">
                            <h2>End:</h2>
                            <v-time-picker
                                v-model="data.end"
                                :error-messages="v$.end.$errors.map(e => e.$message)"
                                :min="start"
                                format="24hr"
                                required
                            ></v-time-picker>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text="Close"
                        variant="plain"
                        @click="closeModal"
                        prepend-icon="mdi-close-circle"
                    ></v-btn>
                    <v-btn
                        color="primary"
                        text="Save"
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

    // Props
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

    const importance = [
        {
            label: "Very High",
            value: "#D50000"
        },
        {
            label: "High",
            value: "#FF6D00"
        },
        {
            label: "Medium",
            value: "#2962FF"
        },
        {
            label: "Low",
            value: "#00C853"
        }
    ];

    const internalModalOpen = reactive({ value: props.isModalOpen });

    const appoinment = props.state == "new" ? {
        title: null,
        description: null,
        date: null,
        start: null,
        end: null,
        importance: null,
        status: props.state
    }:{
        ...props.record,
        date: props.record.date.toISOString().split('T')[0]
    }

    const data = reactive({
        ...appoinment
    })

    const emit = defineEmits(['save', 'close']);

    // Validation rules
    const rules = {
        title: { required },
        description: { required },
        date: { required },
        start: { required },
        end: { required },
        importance: {required }
    };

    const v$ = useVuelidate(rules, data);

    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    // Methods
    function saveAppointment() {
        if (v$.value.$invalid) return; // Prevent saving if invalid
        // // Emit save event with patient data
        emit('save', data);
        closeModal()
    }

    function closeModal() {
        emit('close');
    }
</script>
