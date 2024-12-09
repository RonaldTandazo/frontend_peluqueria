import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const userService = {
    async updateUserInformation(data){
        const response = await axios.post(`${API_URL}/user/update_information`, data)
        return response
    },

    async getAllUsers(data, page, size){
        const response = await axios.get(`${API_URL}/user/get_all_users`, {params: { 
            ...data,
            page: page, 
            size: size 
        }})
        return response
    }
};
