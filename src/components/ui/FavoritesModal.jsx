import React, { useContext } from 'react';
import { CharactersContext } from '../context/CharactersContext';
import { Link } from 'react-router-dom';

const FavoritesModal = ({ isOpen, onClose }) => {
  const { favorites, removeFavorite, clearAllFavorites, theme } = useContext(CharactersContext);

  if (!isOpen) return null;

  const modalBgClass = theme === 'dark' ? 'bg-gray-800 border-purple-600' : 'bg-white border-gray-300';
  const headerTextClass = theme === 'dark' ? 'text-purple-400' : 'text-indigo-600';
  const itemTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const buttonClass = "py-1 px-3 rounded text-sm font-semibold transition duration-150";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      
      <div 
        className={`w-full max-w-lg mx-auto border-2 rounded-xl shadow-2xl transition-all p-6 ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-300 dark:border-gray-700">
          <h2 className={`text-2xl font-extrabold ${headerTextClass}`}>
            ❤️ My Favorite Characters ({favorites.length})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-3xl leading-none">
            &times;
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {favorites.length === 0 ? (
            <p className={`text-center py-8 ${itemTextClass} italic`}>
              No hay personajes favoritos aún. ¡Añade algunos!
            </p>
          ) : (
            <ul className="space-y-4">
              {favorites.map((character) => (
                <li key={character.id} className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:shadow-md transition duration-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={character.imagen} 
                      alt={character.nombre} 
                      className="w-10 h-10 object-cover rounded-full"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/374151/ffffff?text=X"}}
                    />
                    <Link 
                        to={`/characters/${character.id}`} 
                        onClick={onClose}
                        className={`font-medium hover:text-indigo-500 dark:hover:text-purple-300 ${itemTextClass}`}
                    >
                        {character.nombre}
                    </Link>
                  </div>
                  
                  <button 
                    onClick={() => removeFavorite(character.id)}
                    className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white`}
                    title={`Remove ${character.nombre} from favorites`}
                  >
                    🗑️ Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-end">
          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className={`${buttonClass} bg-red-700 hover:bg-red-800 text-white`}
            >
              🧹 Clear All ({favorites.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;