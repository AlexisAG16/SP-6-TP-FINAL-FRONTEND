import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { cargarObrasMockApi } from '../../../api/ObrasApi';
import { Link, useNavigate } from 'react-router-dom';
import { ObrasContext } from '../../context/ObrasContext'; 
import { AuthContext } from '../../context/AuthContext'; 
import LoadingSpinner from '../../ui/LoadingSpinner';

const ObraList = () => {
  const { obrasList, loadingObras, handleDeleteObra } = useContext(ObrasContext);
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loadingObras) return <LoadingSpinner message="Cargando obras..." />;

  const handleCargarMockApi = async () => {
    try {
      const token = user?.token;
      const { data } = await cargarObrasMockApi(token);
      if (data.message?.includes('cargadas en la base') || data.message?.includes('todas las obras')) {
        toast.info(data.message);
      } else {
        toast.success(data.message || 'Obras cargadas desde MockAPI.');
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error al cargar obras desde MockAPI.';
      toast.error(msg);
    }
  };

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 w-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-indigo-700 dark:text-purple-300 text-center sm:text-left w-full sm:w-auto">
          📚 Listado de Obras
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isAdmin && (
            <>
              <button
                onClick={handleCargarMockApi}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md w-full sm:w-auto text-center"
              >
                🔄 Cargar Obras MockAPI
              </button>
              <button
                onClick={() => navigate('/obras/create')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md w-full sm:w-auto text-center"
              >
                ➕ Crear Nueva Obra
              </button>
            </>
          )}
        </div>
      </div>
      
      {obrasList.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-2xl font-semibold text-indigo-500 dark:text-purple-400">
            No hay obras registradas en la base de datos.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {obrasList.map((obra) => (
            <div 
              key={obra._id || obra.id} 
              className="p-4 border rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 dark:border-purple-600 transition duration-300"
            >
              <div className="w-full sm:w-auto flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-purple-400">
                  {obra.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Tipo: <span className="font-medium">{obra.tipo || 'Desconocido'}</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end">
                <Link
                  to={`/obras/${obra._id || obra.id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-2 px-4 rounded transition duration-150 text-sm w-full sm:w-auto text-center"
                >
                  Ver Detalles
                </Link>
                {isAdmin && (
                    <>
                        <button
                            onClick={() => navigate(`/obras/${obra._id || obra.id}/edit`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-150 text-sm w-full sm:w-auto text-center"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleDeleteObra(obra._id || obra.id, obra.titulo)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-150 text-sm w-full sm:w-auto text-center"
                        >
                            🗑️ Eliminar
                        </button>
                    </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObraList;