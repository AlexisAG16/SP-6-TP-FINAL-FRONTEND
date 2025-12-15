import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loginUser, registerUser } from '../../api/AuthApi';
import { toast } from 'react-toastify';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);
    
    const isLoggedIn = !!token;
    
    const saveAuthData = useCallback((user, token) => {
        setUser(user);
        setToken(token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);


    const login = useCallback(async (credentials) => {
        try {
            const { data } = await loginUser(credentials);
            saveAuthData(data.user, data.token);
            toast.success(`Bienvenido, ${data.user.nombre}. Rol: ${data.user.rol.toUpperCase()}`);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Credenciales inválidas o error de conexión.";
            toast.error(errorMessage);
            return false;
        }
    }, [saveAuthData]);

    const register = useCallback(async (userData) => {
        try {
            const { data } = await registerUser(userData);
            saveAuthData(data.user, data.token);
            toast.success(`Cuenta creada para ${data.user.nombre}. ¡Ya estás logueado!`);
            return true;
        } catch (error) {
            if (error?.response?.status === 409 && error?.response?.data?.message?.includes('email')) {
                toast.error(error.response.data.message || "El email ya está registrado.");
            } else {
                const errorMessage = error.response?.data?.message || "Error al registrar. El email podría estar ya en uso.";
                toast.error(errorMessage);
            }
            return false;
        }
    }, [saveAuthData]);
    
    const logout = useCallback(() => {
        try {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const userKey = parsed?.id || parsed?._id || parsed?.email || 'anon';
                window.localStorage.removeItem(`app-favorites-${userKey}`);
            }
        } catch(error) {
            toast.error(error,"No se pudo cerrar sesión");
        }
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        toast.info("Sesión cerrada correctamente.");
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        isLoggedIn,
        login,
        register,
        logout,
        
        isAdmin: !!user?.rol && String(user.rol).toLowerCase() === 'admin', 
    }), [user, token, isLoggedIn, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};