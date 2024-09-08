import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const patientsService = {
    async getPatientsByDoctorId(data, page, size){
        const response = await axios.get(`${API_URL}/patients/patients_by_doctor`, {params: { user_id: data, page: page, size: size }})
        return response
    }
};