import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const medicationService = {
    async getAllMedications(data, page, size){
        const response = await axios.get(`${API_URL}/medications/medications_by_name`, {params: { 
            ...data,
            page: page, 
            size: size 
        }})
        return response
    }
};