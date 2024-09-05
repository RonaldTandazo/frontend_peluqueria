import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const patientsService = {
    async getPatientsByDoctorId(data){
        console.log(data)
        const response = await axios.post(`${API_URL}/patients/patients_by_doctor`, data)
        return response
    }
};