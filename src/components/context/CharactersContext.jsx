import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from '../../api/CharacterApi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useTheme } from '../../hooks/useTheme';
import useLocalStorage from '../../hooks/useLocalStorage';
import { AuthContext } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export const CharactersContext = createContext();

export const CharactersProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1, totalItems: 0, itemsPerPage: 8 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { theme, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext);

  const [filterType, setFilterType] = useState('');
  const [searchTermName, setSearchTermName] = useState('');

  // Favoritos por usuario (clave única por id/email)
  const userKey = user?.id || user?._id || user?.email || 'anon';
  const [favorites, setFavorites] = useLocalStorage(`app-favorites-${userKey}`, []);



  // --- LÓGICA CRUD ---

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTermName, meta.itemsPerPage]);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const { data } = await getCharacters(currentPage, meta.itemsPerPage, filterType, searchTermName);
        // La API devuelve { personajes: [], meta: {} }
        const raw = Array.isArray(data) ? data : (data?.personajes || []);
        const charactersWithArrayPowers = (raw || []).map(char => ({
          ...char,
          poderes: Array.isArray(char.poderes) 
            ? char.poderes 
            : (char.poderes ? char.poderes.split(',').map(p => p.trim()) : [])
        }));
        setCharacters(charactersWithArrayPowers);
        setMeta(data?.meta || { totalPages: 1, currentPage: 1, totalItems: raw.length, itemsPerPage: 8 });
      } catch (error) {
        console.error("Error fetching characters:", error);
        toast.error("Error al cargar la lista de personajes.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [currentPage, meta.itemsPerPage, filterType, searchTermName]);

      const handleDelete = useCallback(async (id, nombre) => {
      Swal.fire({
        title: `¿Estás seguro de eliminar a ${nombre}?`,
        text: "¡Esta acción es irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: theme === 'dark' ? 'dark-swal' : ''
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteCharacter(id);
            setLoading(true);
            const { data } = await getCharacters(currentPage, meta.itemsPerPage);
            const raw = Array.isArray(data) ? data : (data?.personajes || []);
            const charactersWithArrayPowers = (raw || []).map(char => ({
              ...char,
              poderes: Array.isArray(char.poderes) 
                ? char.poderes 
                : (char.poderes ? char.poderes.split(',').map(p => p.trim()) : [])
            }));
            setCharacters(charactersWithArrayPowers);
            setMeta(data?.meta || { totalPages: 1, currentPage: 1, totalItems: raw.length, itemsPerPage: 8 });
            toast.success("Personaje eliminado correctamente.");
          } catch {
            toast.error("Error al eliminar personaje.");
          } finally {
            setLoading(false);
          }
        }
      });
      }, [theme, currentPage, meta.itemsPerPage]);

  const handleCreate = useCallback(async (characterData) => {
    try {
      await createCharacter(characterData);
      setLoading(true);
      const { data } = await getCharacters(currentPage, meta.itemsPerPage);
      const raw = Array.isArray(data) ? data : (data?.personajes || []);
      const charactersWithArrayPowers = (raw || []).map(char => ({
        ...char,
        poderes: Array.isArray(char.poderes) 
          ? char.poderes 
          : (char.poderes ? char.poderes.split(',').map(p => p.trim()) : [])
      }));
      setCharacters(charactersWithArrayPowers);
      setMeta(data?.meta || { totalPages: 1, currentPage: 1, totalItems: raw.length, itemsPerPage: 8 });
      toast.success("Personaje creado correctamente.");
    } catch {
      toast.error("Error al crear personaje.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, meta.itemsPerPage]);

  // Actualizar personaje
  const handleUpdate = useCallback(async (id, characterData) => {
    try {
      await updateCharacter(id, characterData);
      setLoading(true);
      const { data } = await getCharacters(currentPage, meta.itemsPerPage);
      const raw = Array.isArray(data) ? data : (data?.personajes || []);
      const charactersWithArrayPowers = (raw || []).map(char => ({
        ...char,
        poderes: Array.isArray(char.poderes) 
          ? char.poderes 
          : (char.poderes ? char.poderes.split(',').map(p => p.trim()) : [])
      }));
      setCharacters(charactersWithArrayPowers);
      setMeta(data?.meta || { totalPages: 1, currentPage: 1, totalItems: raw.length, itemsPerPage: 8 });
      toast.success("Personaje actualizado correctamente.");
    } catch {
      toast.error("Error al actualizar personaje.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, meta.itemsPerPage]);


  // --- LÓGICA DE FAVORITOS ---
  
  const isFavorite = useCallback((id) => {
    return favorites.some(char => char.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((character) => {
    try {
      const isFav = isFavorite(character._id || character.id);
      const charId = character._id || character.id;
      const favCharacter = {
        id: charId,
        nombre: character.nombre,
        imagen: character.imagen,
        tipo: character.tipo
      };
      if (isFav) {
        setFavorites(prev => prev.filter(char => char.id !== charId));
        toast.info(`${character.nombre} eliminado de favoritos.`, { icon: "💔" });
      } else {
        // Si ya existe, advertir (doble chequeo defensivo)
        if (favorites.some(char => char.id === charId)) {
          toast.warn(`${character.nombre} ya está en favoritos.`);
          return;
        }
        setFavorites(prev => [...prev, favCharacter]);
        toast.success(`${character.nombre} añadido a favoritos.`, { icon: "💖" });
      }
    } catch (err) {
      toast.error('Ocurrió un error al modificar favoritos.');
    }
  }, [isFavorite, setFavorites, favorites]);

  const removeFavorite = useCallback((id) => {
    const removedChar = favorites.find(char => char.id === id);
    setFavorites(prev => prev.filter(char => char.id !== id));
    
    if(removedChar) {
        toast.info(`${removedChar.nombre} eliminado de la lista.`, { icon: "💔" });
    } else {
        toast.info("Elemento eliminado de favoritos.");
    }
  }, [setFavorites, favorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);

    toast.info("Todos los favoritos han sido eliminados. Lista vacía.", { icon: "🧹" });
  }, [setFavorites]);
  
    const filteredCharacters = useMemo(() => characters, [characters]);

  // Valor del Contexto
  const contextValue = useMemo(() => ({
    characters: filteredCharacters,
    loading,
    handleDelete,
    handleCreate,
    handleUpdate,
    filterType,
    setFilterType,
    setSearchTermName,
    currentPage,
    setCurrentPage,
    meta,
    theme,
    toggleTheme,
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  }), [
    filteredCharacters,
    loading,
    handleDelete,
    handleCreate,
    handleUpdate,
    filterType,
    setFilterType,
    setSearchTermName,
    currentPage,
    setCurrentPage,
    meta,
    theme,
    toggleTheme,
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites
  ]);

  return (
    <CharactersContext.Provider value={contextValue}>
      {children}
    </CharactersContext.Provider>
  );
};