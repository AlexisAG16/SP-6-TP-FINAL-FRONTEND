import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/personajes`; 

export const getCharacters = async (page = 1, limit = 8, tipo = '', nombre = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (tipo && tipo.trim()) params.append('tipo', tipo.trim());
    if (nombre && nombre.trim()) params.append('nombre', nombre.trim());
    return axios.get(`${BASE_URL}?${params.toString()}`);
};

export const getCharacterById = async (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const createCharacter = async (newCharacter) => {
    return axios.post(BASE_URL, newCharacter);
};

export const updateCharacter = async (id, updatedData) => {
    return axios.put(`${BASE_URL}/${id}`, updatedData);
};

export const deleteCharacter = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};