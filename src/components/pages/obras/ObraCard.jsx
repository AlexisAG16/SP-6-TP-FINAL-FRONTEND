import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ObrasContext } from '../../context/ObrasContext';
import { AuthContext } from '../../context/AuthContext';

const ObraCard = ({ obra }) => {
  const { handleDelete } = useContext(ObrasContext);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const obraId = obra._id || obra.id; 

  return (
    <div className="card border rounded-lg overflow-hidden shadow-lg 
        bg-white dark:bg-gray-900 dark:border-indigo-600 transition duration-300">
      
      <img 
        src={obra.imagen} 
        alt={obra.titulo} 
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/320x240/374151/ffffff?text=NO+IMG" }}
      />
      
      <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
        {/* Info */}
        <div className='grow'>
          <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-400">
            {obra.titulo}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Año: {obra.anioPublicacion || obra.anio || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Género: <span className='font-semibold'>{obra.genero || 'N/A'}</span>
          </p>
        </div>

        <div className={`flex justify-between space-x-2 mt-4 ${isAdmin ? '' : 'justify-center'}`}>
          
          <Link to={`/obras/${obraId}`}
             className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-1 px-3 rounded text-sm transition">
            Ver Detalles
          </Link>
          
          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/obras/${obraId}/edit`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => handleDelete(obraId, obra.titulo)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
              >
                🗑️ Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObraCard;