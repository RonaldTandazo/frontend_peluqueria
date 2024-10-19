import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const specialityService = {
    async getAllSpecialities(){
        const response = await axios.get(`${API_URL}/specialities`)
        return response
    },
};