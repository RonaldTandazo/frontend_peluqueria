import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const userService = {
    async update_user_information(data){
        const response = await axios.post(`${API_URL}/user/update_information`, data)
        return response
    }
};
