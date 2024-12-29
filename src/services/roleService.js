import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const roleService = {
    async getUserRoles(userData) {
        const response = await axios.post(`${API_URL}/user_roles`, userData);
        console.log(response)
        return response;
    }
};
