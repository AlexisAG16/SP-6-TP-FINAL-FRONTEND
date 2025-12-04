import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext'; 

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isLoggedIn, user } = useContext(AuthContext); 

    if (!isLoggedIn) {
        toast.warn("Necesitas iniciar sesión para acceder a esta página.");
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles.length > 0) {
        const userRole = user?.rol ? String(user.rol).toLowerCase() : null;
        const allowed = allowedRoles.map(r => String(r).toLowerCase());

        if (!userRole || !allowed.includes(userRole)) {
            toast.error("No tienes permisos suficientes para acceder a esta función.");
            return <Navigate to="/characters" replace />; 
        }
    }

    return children;
};

export default ProtectedRoute;