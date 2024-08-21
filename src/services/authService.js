import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const authService = {
    async registerUser(userData) {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    async loginUser(userData) {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    },
    // Agrega más métodos según sea necesario
};
