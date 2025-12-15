import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../../../api/CharacterApi';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../ui/LoadingSpinner';

const DetailRow = ({ label, value }) => (
  <div className="py-2 border-b border-gray-200 dark:border-gray-700">
    <span className="font-semibold text-gray-900 dark:text-gray-200">{label}: </span>
    <span className="text-gray-700 dark:text-gray-400">{value}</span>
  </div>
);

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const { data } = await getCharacterById(id); 
        setCharacter(data);
      } catch (error) {
        toast.error(error,"Error al cargar detalles del personaje.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner message="Cargando detalles del personaje..." />;
  if (!character) return null; 

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAdmin } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-900 shadow-xl rounded-lg p-8 transition duration-300">
      <button
        onClick={() => navigate('/characters')}
        className="mb-6 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:text-purple-500 transition duration-150"
      >
        &#x2190; Volver al inicio
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 dark:text-purple-400">
        {character.nombre}
      </h1>

      <div className="md:flex md:space-x-8">
        <div className="w-full md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
          <img
            src={character.imagen}
            alt={character.nombre}
            className="w-full max-w-xs md:max-w-md md:max-h-[400px] aspect-3/4 object-contain rounded-lg shadow-md bg-gray-100 dark:bg-gray-800"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/320x240/374151/ffffff?text=X"}}
          />
        </div>
        <div className="md:w-1/2">
          <DetailRow label="Tipo" value={character.tipo} />
          <DetailRow label="Clasificación" value={character.clasificacion} />
          <div className="flex items-center gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-900 dark:text-gray-200">Obra Relacionada: </span>
            <span className="text-gray-700 dark:text-gray-400">{character.obra?.titulo || 'N/A'}</span>
            {isAdmin && character.obra?._id && (
              <button
                onClick={() => navigate(`/obras/${character.obra._id}`)}
                className="ml-2 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition duration-150"
                title="Ver detalle de la obra"
              >
                Ir a Obra
              </button>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-300">Poderes:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4 dark:text-gray-400">
              {(Array.isArray(character.poderes) ? character.poderes : [character.poderes]).map((p, index) => (
                <li key={index}>{p}</li>
              ))}
            </ul>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate(`/characters/${character._id || character.id}/edit`)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              ✏️ Editar Personaje
            </button>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-300">Descripción:</h3>
        <p className="text-gray-700 dark:text-gray-400">{character.descripcion || 'No hay descripción disponible.'}</p>
      </div>
    </div>
  );
};

export default CharacterDetail;