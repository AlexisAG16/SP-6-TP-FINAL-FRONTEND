import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CharactersContext } from '../../context/CharactersContext';
import { AuthContext } from '../../context/AuthContext';

const CharacterCard = ({ character }) => {
  const { handleDelete, isFavorite, toggleFavorite } = useContext(CharactersContext);
  const { isAdmin, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const favorite = isFavorite(character._id || character.id);
  const favIcon = favorite ? '💖' : '🤍';
  const favClass = favorite 
    ? "bg-pink-500 hover:bg-pink-600 text-white" 
    : "bg-gray-300 hover:bg-pink-400 text-gray-800 dark:bg-gray-700 dark:hover:bg-pink-500 dark:text-gray-200";

  const charId = character._id || character.id; 

  return (
    <div className="card border rounded-lg overflow-hidden shadow-lg 
        bg-white dark:bg-gray-900 dark:border-purple-600 transition duration-300">
      
      <img 
        src={character.imagen} 
        alt={character.nombre} 
        className="w-full h-80 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/320x240/374151/ffffff?text=X"}}
      />
      
      <div className="p-4 grow flex flex-col justify-between">
        <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-purple-400">
          {character.nombre}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          Obra: {character.obra?.titulo || 'Sin Obra'}
        </p>

        <p className="text-md font-medium text-gray-700 dark:text-gray-300">
          Tipo: {character.tipo}
        </p>

        <div className="flex justify-between space-x-2 mt-4">
          
          <Link to={`/characters/${charId}`}
             className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-1 px-3 rounded text-sm transition">
            Details
          </Link>
          
          {isAdmin && (
            <button
              onClick={() => navigate(`/characters/${charId}/edit`)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
            >
              Edit
            </button>
          )}
          
          {(isLoggedIn || isAdmin) && (
            <button
            onClick={() => toggleFavorite(character)}
            className={`font-semibold py-1 px-3 rounded text-sm transition ${favClass}`}
            title={favorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {favIcon}
          </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleDelete(charId, character.nombre)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;