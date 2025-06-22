const API_URL = process.env.VUE_APP_URL || 'http://localhost:4000/api';
const token = localStorage.getItem('token');

export const ServiciosService = {
    async getServicios(){
        const url = `${API_URL}/servicios/all`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();

            if(!data.ok){
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
};