import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CharactersContext } from '../../context/CharactersContext';
import { AuthContext } from '../../context/AuthContext';
import CharacterCard from './CharacterCard';
import LoadingSpinner from '../../ui/LoadingSpinner';

const CharacterList = () => {
  const context = useContext(CharactersContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const characters = context?.characters || [];
  const loading = context?.loading;
  const filterType = context?.filterType || '';
  const setFilterType = context?.setFilterType || (()=>{});
  const [typeInput, setTypeInput] = useState(filterType);
  const setSearchTermName = context?.setSearchTermName || (()=>{});
  const setCurrentPage = context?.setCurrentPage || (()=>{});
  const meta = context?.meta || { totalPages: 1, currentPage: 1 };
  const { isAdmin } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueTypes = useMemo(() => {
    const types = characters.map(char => char.tipo?.trim?.()).filter(Boolean);
    return [...new Set(types)];
  }, [characters]);

  const handleTypeInputChange = (e) => {
    setTypeInput(e.target.value);
  };

  const handleTypeSearch = (e) => {
    e.preventDefault();
    setFilterType(typeInput);
  };

  const handleResetType = () => {
    setTypeInput('');
    setFilterType('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTermName(searchTerm);
  };

  const handleResetSearch = () => {
    setSearchTermName('');
    setSearchTerm('');
  };

  if (loading) return <LoadingSpinner message="Cargando personajes..." />;

  const filterContainerClass = "p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md";
  const inputClass = "flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100";
  const buttonClass = "font-bold py-2 px-4 rounded-lg transition duration-200";

  return (
    <div className="max-w-7xl mx-auto py-8">
      
      {/* 1. Encabezado y Botón de Creación */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-purple-300 text-center sm:text-left w-full sm:w-auto">Personajes Fantásticos</h1>
        {isAdmin && (
          <Link 
            to="/characters/create" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm w-full sm:w-auto text-center"
          >
            ➕ Crear Nuevo Personaje
          </Link>
        )}
      </div>
      
      {/* 2. Contenedor de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
        
        {/* Búsqueda por Nombre (Home.jsx) */}
        <div className={`md:w-1/2 ${filterContainerClass}`}>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Búsqueda por Nombre</h3>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca un personaje por nombre..."
                className={inputClass + ' w-full'}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  type="submit" 
                  disabled={!searchTerm.trim()} 
                  className={`${buttonClass} bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 dark:bg-purple-600 dark:hover:bg-purple-700 dark:disabled:bg-gray-600 w-full sm:w-auto`}
                >
                  Buscar
                </button>
                <button 
                  type="button" 
                  onClick={handleResetSearch}
                  className={`${buttonClass} bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto`}
                >
                  Limpiar
                </button>
              </div>
            </form>
        </div>
        
        {/* Filtro por Tipo*/}
        <div className={`md:w-1/2 ${filterContainerClass}`}>
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Filtro por Tipo</h3>
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipos disponibles: {uniqueTypes.slice(0, 4).join(', ') || 'Bruja, Mago, Vampiro'}
          </label>
          <form onSubmit={handleTypeSearch} className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              id="typeFilter"
              value={typeInput}
              onChange={handleTypeInputChange}
              placeholder="Escribe el tipo de personaje para filtrar..."
              className={inputClass + ' w-full'}
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={!typeInput.trim()}
                className={`${buttonClass} bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 dark:bg-purple-600 dark:hover:bg-purple-700 dark:disabled:bg-gray-600 w-full sm:w-auto`}
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={handleResetType}
                className={`${buttonClass} bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto`}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 3. Lista de Personajes (Manejo de Resultados) */}
      
      {((characters.length === 0 || !Array.isArray(characters)) && !loading) ? (
        <div className="text-center p-10 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-2xl font-semibold text-red-500 dark:text-red-400">
            No se encontraron personajes.
          </p>
          {(searchTerm.trim() || filterType.trim()) && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Intenta limpiar la búsqueda o el filtro de tipo.
              </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(Array.isArray(characters) ? characters : [])
              .filter(character => {
                // Filtrado por tipo (contiene, insensible a mayúsculas)
                if (!filterType.trim()) return true;
                return (character.tipo || '').toLowerCase().includes(filterType.trim().toLowerCase());
              })
              .map(character => (
                <CharacterCard key={character._id || character.id} character={character} />
              ))}
          </div>
          {/* Controles de paginación reales */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(meta.currentPage - 1)}
                disabled={meta.currentPage === 1}
              >
                ← Anterior
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-2 rounded font-bold cursor-pointer ${meta.currentPage === i + 1 ? 'bg-indigo-600 dark:bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={meta.currentPage === i + 1}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(meta.currentPage + 1)}
                disabled={meta.currentPage === meta.totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterList;