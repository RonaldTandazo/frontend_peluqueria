import axios from './axios';

const API_URL = process.env.VUE_APP_URL || 'http://localhost:8081/api';

export const userRoleService = {
    async roleActivationControl(user_role_id, state){
        const response = await axios.put(`${API_URL}/user_roles/role_activation_control/${user_role_id}`, null, {params: { state: state }})
        return response
    }
};
