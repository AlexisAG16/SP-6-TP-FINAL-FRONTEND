import axios from 'axios';

const AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`; 

export const registerUser = async (userData) => {
    return axios.post(`${AUTH_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
    return axios.post(`${AUTH_URL}/login`, credentials);
};