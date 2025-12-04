import React, { useContext } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ObrasContext } from '../../context/ObrasContext';
import ObraForm from './ObraForm';
import LoadingSpinner from '../../ui/LoadingSpinner';

const ObraEdit = () => {
    const { id } = useParams();
    const { obrasList: obras, loadingObras: loading } = useContext(ObrasContext);
    const navigate = useNavigate();

    if (loading) return <LoadingSpinner message="Cargando obra..." />;

    const obraToEdit = obras.find(o => (o._id || o.id) === id);

    if (!obraToEdit) {
        return <Navigate to="/obras" replace />; 
    }

    return (
        <div className="py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:text-purple-500 transition duration-150 flex items-center max-w-xl mx-auto"
            >
                &#x2190; Cancelar y Volver
            </button>

            <ObraForm obraToEdit={obraToEdit} />
        </div>
    );
};

export default ObraEdit;