import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ObrasContext } from '../../context/ObrasContext';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { toast } from 'react-toastify';

const DetailRow = ({ label, value }) => (
    <div className="py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="font-semibold text-gray-900 dark:text-gray-200">{label}: </span>
      <span className="text-gray-700 dark:text-gray-400">{value}</span>
    </div>
);

const ObraDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { obrasList, loadingObras, handleDeleteObra } = useContext(ObrasContext);
    const { user, isAdmin } = useContext(AuthContext);

    const obra = obrasList.find(o => (o._id || o.id) === id);
    
    if (loadingObras) return <LoadingSpinner message="Cargando detalles de la obra..." />;

    if (!obra) {
        toast.error(`Obra con ID ${id} no encontrada.`);
        return (
            <div className="text-center py-10">
                <p className="text-xl dark:text-gray-300">Obra no encontrada. Puede haber sido eliminada.</p>
                <button
                    onClick={() => navigate('/obras')}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                >
                    Volver al Listado
                </button>
            </div>
        );
    }
    
    const imageUrl = obra.imagen || "https://placehold.co/400x600/374151/ffffff?text=NO+IMAGE";

    return (
        <div className="py-8 max-w-5xl mx-auto">
            {/* Botón solo visible en mobile para volver al inicio */}
            <div className="block sm:hidden mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 w-full flex items-center justify-center gap-2"
                >
                    <span className="text-lg">🏠</span> Volver al Inicio
                </button>
            </div>
            <h1 className="text-5xl font-bold mb-6 text-indigo-700 dark:text-purple-400">
                {obra.titulo}
            </h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Columna de Imagen */}
                <div className="md:w-1/3">
                    <img 
                        src={imageUrl} 
                        alt={obra.titulo} 
                        className="w-full h-auto object-cover rounded-lg shadow-xl"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x600/374151/ffffff?text=NO+IMAGE" }}
                    />
                </div>

                <div className="md:w-2/3">
                    <DetailRow label="Tipo de Obra" value={obra.tipo || 'Desconocido'} />
                    <DetailRow label="Año de Publicación" value={obra.anioPublicacion || 'N/A'} />
                    <DetailRow label="Género" value={obra.genero || 'N/A'} />
                    
                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Sinopsis:</h3>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                            {obra.sinopsis || 'Sinopsis no disponible.'}
                        </p>
                    </div>

                    {isAdmin && (
                        <div className="mt-8 flex space-x-4">
                            <button
                                onClick={() => navigate(`/obras/${id}/edit`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 dark:bg-purple-600 dark:hover:bg-purple-700"
                            >
                                ✏️ Editar Obra
                            </button>
                            <button
                                onClick={() => handleDeleteObra(id, obra.titulo)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                🗑️ Eliminar Obra
                            </button>
                        </div>
                    )}
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:text-purple-500 transition duration-150 flex items-center"
                    >
                        &#x2190; Volver al Listado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObraDetail;