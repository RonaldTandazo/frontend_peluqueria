const API_URL = process.env.VUE_APP_URL || 'http://localhost:4000/api';
const token = localStorage.getItem('token');

export const AtencionesService = {
    async getAtencionesByCita(id_cita, page, size){
        const queryParams = {
            id_cita: id_cita,
            page: page,
            size: size
        };

        const queryString = new URLSearchParams(queryParams).toString();

        const url = `${API_URL}/atenciones/all?${queryString}`;

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

    async store(data_atencion, id_usuario){
        try {
            const data_store = {
                id_usuario,
                data_atencion
            }

            const response = await fetch(`${API_URL}/atenciones/store`, {
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

    async delete(id_atencion){
        try {
            const response = await fetch(`${API_URL}/atenciones/delete/${id_atencion}`, {
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