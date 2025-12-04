import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

const Register = () => {
    const [userData, setUserData] = useState({ nombre: '', email: '', password: '', adminCode: '' });
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { register, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/characters', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const err = {};
        if (!userData.nombre.trim()) err.nombre = 'El nombre es obligatorio.';
        if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) err.email = 'Email inválido.';
        if (!userData.password || userData.password.length < 6) err.password = 'La contraseña debe tener mínimo 6 caracteres.';
        if (isAdminMode && (!userData.adminCode || userData.adminCode.trim().length === 0)) err.adminCode = 'Código admin requerido para crear administrador.';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!validate()) {
            setIsSubmitting(false);
            return;
        }

        const payload = { ...userData };
        payload.nombre = DOMPurify.sanitize(String(payload.nombre || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        if (payload.adminCode) payload.adminCode = DOMPurify.sanitize(String(payload.adminCode).trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        if (!isAdminMode) delete payload.adminCode;

        const success = await register(payload);
        
        setIsSubmitting(false);

        if (success) {
            setTimeout(() => {
                navigate('/characters', { replace: true });
            }, 150);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-300 relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 z-30 flex items-center justify-center rounded-xl">
                            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-indigo-600 dark:border-purple-400"></div>
                        </div>
                    )}
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-600 dark:text-indigo-400">
                    Crear Cuenta ✍️
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label 
                            htmlFor="nombre" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Tu nombre"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Contraseña (mín. 6 caracteres)
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Define una contraseña segura"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Opcional: Crear como admin usando un código secreto */}
                    <div className="flex items-center space-x-3">
                        <input
                            id="isAdminMode"
                            type="checkbox"
                            checked={isAdminMode}
                            onChange={() => setIsAdminMode(prev => !prev)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isAdminMode" className="text-sm text-gray-700 dark:text-gray-300">Crear como administrador</label>
                    </div>

                    {isAdminMode && (
                        <div>
                            <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Admin (secreto)</label>
                            <input
                                type="password"
                                id="adminCode"
                                name="adminCode"
                                value={userData.adminCode}
                                onChange={(e) => setUserData({ ...userData, adminCode: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                                placeholder="Código secreto para crear un admin"
                            />
                            {errors.adminCode && <p className="text-red-500 text-xs mt-1">{errors.adminCode}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition duration-150 ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700'
                        }`}
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar y Entrar'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes cuenta?{' '}
                    <button 
                        onClick={() => navigate('/login')}
                        className="font-medium text-purple-600 hover:text-purple-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Inicia Sesión
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;