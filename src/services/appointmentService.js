import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const appointmentService = {
    async store(appointment){
        const response = await axios.post(`${API_URL}/appointments/store`, appointment)
        return response
    },
};