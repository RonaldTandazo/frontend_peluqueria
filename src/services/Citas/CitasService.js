const API_URL = process.env.VUE_APP_URL || 'http://localhost:4000/api';
const token = localStorage.getItem('token');

export const CitasService = {
    async getCitas(page, size){
        const queryParams = {
            page: page,
            size: size
        };

        const queryString = new URLSearchParams(queryParams).toString();

        const url = `${API_URL}/citas/all?${queryString}`;

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
    },

    async store(data_cita){
        try {
            const data_store = {
                data_cita
            }

            const response = await fetch(`${API_URL}/citas/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_store),
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    },

    async update(id_cita, data_cita){
        try {
            const response = await fetch(`${API_URL}/citas/update/${id_cita}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_cita),
            });

            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    },

    async delete(id_cita){
        try {
            const response = await fetch(`${API_URL}/citas/delete/${id_cita}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!data.ok) {
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