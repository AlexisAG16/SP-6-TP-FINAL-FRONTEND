import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/characters', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const err = {};
        if (!credentials.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) err.email = 'Email inválido.';
        if (!credentials.password.trim()) err.password = 'La contraseña es obligatoria.';
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

        const safeCredentials = { ...credentials, email: DOMPurify.sanitize(String(credentials.email || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) };
        const success = await login(safeCredentials);
        
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
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-purple-400">
                    Iniciar Sesión 👤
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
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
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Introduce tu contraseña"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition duration-150 ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
                        }`}
                    >
                        {isSubmitting ? 'Accediendo...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes cuenta?{' '}
                    <button 
                        onClick={() => navigate('/register')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;