<template>
    <v-dialog v-model="internalModalOpen" max-width="55%" transition="dialog-top-transition" persistent>
        <form @submit.prevent="savePatient">
            <v-card
                prepend-icon="mdi-account-injury"
                :title="state == 'new' ? 'New Patient':'Update Patient Information'"
            >
                <v-divider></v-divider>
                <v-card-text>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.name"
                                :error-messages="v$.patient.name.$error ? ['Name is required'] : []"
                                clearable
                                density="compact"
                                label="Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-n-box"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.lastname"
                                :error-messages="v$.patient.lastname.$error ? ['Last Name is required'] : []"
                                clearable
                                density="compact"
                                label="Last Name"
                                variant="outlined"
                                prepend-inner-icon="mdi-alpha-l-box"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.identification"
                                :error-messages="v$.patient.identification.$error ? ['Identification is required'] : []"
                                clearable
                                density="compact"
                                label="Identification"
                                variant="outlined"
                                prepend-inner-icon="mdi-card-account-details"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Age
                            </div>
                            <v-slider
                                v-model="patient.age"
                                :min="0"
                                :max="110"
                                :step="1"
                                prepend-icon="mdi-calendar-range"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="patient.age"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 85px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="0"
                                        :max="110"
                                        :step="1"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Weight(Kg)
                            </div>
                            <v-slider
                                v-model="patient.weight"
                                :min="45"
                                :max="150"
                                :step="0.1"
                                prepend-icon="mdi-weight-kilogram"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="patient.weight"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 93px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="45"
                                        :max="150"
                                        :step="0.1"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Height(m)
                            </div>
                            <v-slider
                                v-model="patient.height"
                                :min="0"
                                :max="3"
                                :step="0.01"
                                prepend-icon="mdi-human-male-height-variant"
                                :thumb-size="15"
                                thumb-label="always"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        v-model="patient.height"
                                        density="compact"
                                        variant="outlined"
                                        style="width: 85px"
                                        type="number"
                                        hide-details
                                        single-line
                                        :min="0"
                                        :max="3"
                                        :step="0.01"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-select
                                v-model="patient.gender"
                                :error-messages="v$.patient.gender.$error ? ['Gender is required'] : []"
                                clearable
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Gender"
                                variant="outlined"
                                density="compact"
                                prepend-inner-icon="mdi-gender-male"
                                return-object
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.phone"
                                :error-messages="v$.patient.phone.$error ? ['Phone Number is required'] : []"
                                clearable
                                prepend-inner-icon="mdi-phone"
                                label="Phone Number"
                                variant="outlined"
                                density="compact"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.direction"
                                :error-messages="v$.patient.direction.$error ? ['Direction is required'] : []"
                                clearable
                                prepend-inner-icon="mdi-map-marker"
                                label="Direction"
                                variant="outlined"
                                density="compact"
                                required
                                @blur="handleBlur('direction')"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="patient.email"
                                :error-messages="v$.patient.email.$error ? ['E-Mail is required'] : []"
                                clearable
                                prepend-inner-icon="mdi-email"
                                label="E-Mail"
                                variant="outlined"
                                density="compact"
                                required
                                @blur="handleBlur('email')"
                                @input="handleInput('email')"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row cols="12">
                        <v-col cols="12">
                            <v-textarea
                                v-model="patient.disease"
                                :error-messages="v$.patient.disease.$error ? ['Disease is required'] : []"
                                label="Disease"
                                prepend-inner-icon="mdi-medical-bag"
                                density="compact"
                                variant="outlined"
                                rows="1"
                                clearable
                                counter
                                auto-grow
                                required
                                @blur="handleBlur('disease')"
                            ></v-textarea>
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
                        @click="savePatient"
                        prepend-icon="mdi-content-save"
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
        genders: {
            type: Array,
            required: true
        }
    });

    // Reactive state
    const internalModalOpen = reactive({ value: props.isModalOpen });
    const patient = reactive({
        name: null,
        lastname: null,
        identification: null,
        age: null,
        gender: null,
        height: null,
        weight: null,
        phone: null,
        direction: null,
        email: null,
        disease: null
    });

    const emit = defineEmits(['save', 'close']);

    // Validation rules
    const rules = {
        patient: {
            name: { required },
            lastname: { required },
            identification: { required },
            gender: { required },
            phone: { required },
            direction: { required },
            email: { required, email },
            disease: { required },
        }
    };

    const v$ = useVuelidate(rules, { patient });

    watch(() => props.isModalOpen, (val) => {
        internalModalOpen.value = val;
    });

    // Methods
    function savePatient() {
        // if (v$.value.$invalid) return; // Prevent saving if invalid
        // // Emit save event with patient data
        // emit('save', { patient });
    }

    const handleBlur = (field) => {
        v$.value.patient[field].$touch();
    };

    const handleInput = (field) => {
        v$.value.patient[field].$touch();
    };

    function closeModal() {
        internalModalOpen.value = false;
        emit('close');
    }
</script>
