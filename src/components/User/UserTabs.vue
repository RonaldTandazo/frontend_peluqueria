<template>
    <div class="d-flex flex-row">
        <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab
                prepend-icon="mdi-account"
                text="Personal Information"
                value="1"
            ></v-tab>
            <v-tab 
                prepend-icon="mdi-lock" 
                text="Account" 
                value="2"
            ></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="flex-grow-1">
            <v-tabs-window-item value="1">
                <v-card flat style="padding: 0px 5px 10px 5px;">
                    <v-row>
                        <v-col>
                            <v-avatar color="grey-darken-1" size="120" :class="disabled ? 'avatar' : 'pointer'" @click="triggerFileInput">
                                <v-img :src="avatarUrl" alt="User Avatar" cover v-if="avatarUrl"></v-img>
                                <v-icon icon="mdi-account" v-else size="60"></v-icon>
                            </v-avatar>
                            <input type="file" ref="fileInput" class="d-none" @change="onFileSelected" :disabled="disabled"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                            v-model="fullname"
                            label="Fullname"
                            prepend-icon="mdi-badge-account"
                            variant="solo"
                            density="comfortable"
                            :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            v-model="email"
                            label="E-mail"
                            prepend-icon="mdi-email"
                            variant="solo"
                            density="comfortable"
                            :disabled="true"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="identification"
                                label="ID Card"
                                prepend-icon="mdi-card-account-details"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="selectedGender"
                                prepend-icon="mdi-gender-male"
                                :items="genders"
                                item-title="label"
                                item-value="value"
                                label="Gender"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                                clearable
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div class="text-start ms-14" style="color: grey; font-size:13px;">
                                Age
                            </div>
                            <v-slider
                                v-model="age"
                                :min="18"
                                :max="65"
                                :step="1"
                                prepend-icon="mdi-calendar-range"
                                :thumb-size="15"
                                thumb-label
                                :disabled="disabled"
                            ></v-slider>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="phonenumber"
                                prepend-icon="mdi-phone"
                                label="Phone Number"
                                variant="solo"
                                density="comfortable"
                                :disabled="disabled"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="d-flex justify-end">
                            <v-btn
                                v-if="!isEditing"
                                prepend-icon="mdi-file-document-edit"
                                color="blue-accent-2"
                                @click="disabledEdit"
                            >
                                Edit
                            </v-btn>
                            <div v-else>
                                <v-btn
                                    prepend-icon="mdi-close-circle"
                                    color="black"
                                    class="me-2"
                                    @click="cancelEdit"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    prepend-icon="mdi-content-save"
                                    color="blue-accent-2"
                                    @click="updateInformation"
                                >
                                    Save
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
                <v-card flat style="padding: 0px 0px 25px 0px;">
                    <ResetPasswordForm></ResetPasswordForm>
                </v-card>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>
<script>
    import ResetPasswordForm from '../Authentication/ResetPasswordForm.vue';
    import { jwtDecode } from "jwt-decode";
    import { userService } from "../../services/userService";
    
    export default {
        components: {
            ResetPasswordForm
        },
        data: () => ({
            tab: "1",
            disabled: true,
            isEditing: false,
            fullname: null,
            identification: null,
            email: null,
            selectedGender: null,
            age: null,
            phonenumber: null,
            genders: [
                {
                    label: "Man",
                    value: "M",
                },
                {
                    label: "Woman",
                    value: "W"
                }
            ],
            avatarUrl: null
        }),
       
        mounted() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    this.userInfo = jwtDecode(token);
                    this.fullname = this.userInfo.username ?? this.userInfo.username;
                    this.email = this.userInfo.sub ?? this.userInfo.sub;
                    this.identification = this.userInfo.identification ?? this.userInfo.identification;
                    this.selectedGender = this.userInfo.gender ?? this.userInfo.gender;
                    this.age = this.userInfo.age ?? this.userInfo.age;
                    this.phonenumber = this.userInfo.phonenumber ?? this.userInfo.phonenumber;
                } catch (error) {
                    console.error('Invalid token', error);
                }
            }
        },

        methods: {
            disabledEdit(){
                this.isEditing = true;
                this.disabled = false;
            },
            cancelEdit() {
                this.isEditing = false;
                this.disabled = true;
            },
            triggerFileInput() {
                this.$refs.fileInput.click();
            },
            onFileSelected(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.avatarUrl = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            },
            async updateInformation(){
                const userData = {
                    username: this.fullname,
                    email: this.email,
                    identification: this.identification,
                    gender: this.selectedGender,
                    age: this.age,
                    phonenumber: this.phonenumber,
                    avatar: this.avatarUrl
                }

                try{
                    const response = await userService.update_user_information(userData);

                    this.$emit('notify', {message:response.message, ok:response.success, show: true});
                }catch(error){
                    this.$emit('notify', {message:"Failed Saving", ok:false, show: true});
                }
            }
        },  
    };
</script>

<style scoped>
    .d-none {
        display: none;
    }
    .pointer {
        cursor: pointer;
    }
    .avatar {
        opacity: 0.5;
    }
    .v-img {
        object-fit: cover;
    }
</style>

