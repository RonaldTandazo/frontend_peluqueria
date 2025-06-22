const API_URL = process.env.VUE_APP_URL || 'http://localhost:4000/api';
const token = localStorage.getItem('token');

export const clientesService = {
    async getClientes(data, page, size){
        const queryParams = {
            ...data,
            page: page,
            size: size
        };

        const queryString = new URLSearchParams(queryParams).toString();

        const url = `${API_URL}/clientes/all?${queryString}`;

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

    async store(data_cliente, id_usuario){
        try {
            const data_store = {
                id_usuario: id_usuario,
                data_cliente: data_cliente
            }

            const response = await fetch(`${API_URL}/clientes/store`, {
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

    async update(id_cliente, data_cliente){
        try {
            const response = await fetch(`${API_URL}/clientes/update/${id_cliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data_cliente),
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