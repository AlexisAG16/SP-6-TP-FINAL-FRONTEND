export const cargarObrasMockApi = async (token) => {
    return axios.post(
        `${BASE_URL}/cargar-mockapi`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
};
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/obras`; 

export const getObras = async () => {
    return axios.get(BASE_URL);
};

export const getObraById = async (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const createObra = async (newObra) => {
    return axios.post(BASE_URL, newObra);
};

export const updateObra = async (id, updatedData) => {
    return axios.put(`${BASE_URL}/${id}`, updatedData);
};

export const deleteObra = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};