import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getObras, createObra, updateObra, deleteObra } from '../../api/ObrasApi'; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// eslint-disable-next-line react-refresh/only-export-components
export const ObrasContext = createContext();

export const ObrasProvider = ({ children }) => { 
  const [obrasList, setObrasList] = useState([]); 
  const [loadingObras, setLoadingObras] = useState(true);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const { data } = await getObras();

        const normalized = (data || []).map(o => ({
          ...o,
          tipo: o.tipo || o.tipo_obra || '',
            anioPublicacion: o.anioPublicacion || o.anio_publicacion || o.anio || '',
            imagen: o.imagen || o.imagenUrl || '',
            genero: o.genero || '',
          sinopsis: o.sinopsis || ''
        }));
        setObrasList(normalized);
      } catch (error) {
        console.error("Error fetching obras:", error);

        toast.error("Error al cargar la lista de obras. Revisa la conexión con el backend.");
      } finally {
        setLoadingObras(false);
      }
    };
    fetchObras();
  }, []);

  const handleCreateObra = useCallback(async (newObraData) => { 
    try {

      const payload = {
        ...newObraData,
        tipo_obra: newObraData.tipo || newObraData.tipo_obra,
        anio_publicacion: newObraData.anioPublicacion ?? newObraData.anio_publicacion,
        imagen: newObraData.imagenUrl || newObraData.imagen,
        genero: newObraData.genero,
        sinopsis: newObraData.sinopsis
      };

      const { data } = await createObra(payload);

      const d = {
        ...data,
        tipo: data.tipo || data.tipo_obra || '',
        anioPublicacion: data.anioPublicacion || data.anio_publicacion || data.anio || '',
        imagen: data.imagen || data.imagenUrl || '',
        genero: data.genero || '',
        sinopsis: data.sinopsis || ''
      };
      setObrasList(prev => [...prev, d]);

      toast.success(`Obra "${d.titulo}" creada con éxito.`);
      return true;

    } catch (error) {
      if (error?.response?.status === 409 && error?.response?.data?.message?.includes('título')) {
        toast.error(error.response.data.message || "Ya existe una obra con ese título.");
      } else {
        const errorMessage = error.response?.data?.message || "Error al crear la obra.";
        console.error("Error creating obra:", error);

        toast.error(errorMessage);
      }
      return false;
    }
  }, []);

  const handleUpdateObra = useCallback(async (id, updatedData) => {
    try {
        const payload = {
          ...updatedData,
          tipo_obra: updatedData.tipo || updatedData.tipo_obra,
          anio_publicacion: updatedData.anioPublicacion ?? updatedData.anio_publicacion,
          imagen: updatedData.imagenUrl || updatedData.imagen,
          genero: updatedData.genero,
          sinopsis: updatedData.sinopsis
        };

        const { data } = await updateObra(id, payload);
        
        const updated = {
          ...data,
          tipo: data.tipo || data.tipo_obra || '',
          anioPublicacion: data.anioPublicacion || data.anio_publicacion || data.anio || '',
          imagen: data.imagen || data.imagenUrl || '',
          genero: data.genero || '',
          sinopsis: data.sinopsis || ''
        };

        setObrasList(prev => prev.map(obra => 
            (obra._id || obra.id) === id ? updated : obra
        ));

        toast.success(`Obra "${updated.titulo}" actualizada con éxito.`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al actualizar la obra.";
        console.error("Error updating obra:", error);
        toast.error(errorMessage);
        return false;
    }
  }, []);

  // Eliminar una obra
  const handleDeleteObra = useCallback(async (id, titulo) => {
    Swal.fire({
        title: `¿Estás seguro de eliminar la obra "${titulo}"?`,
        text: "¡Esto podría afectar a personajes asociados!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteObra(id);
                setObrasList(prev => prev.filter(obra => (obra._id || obra.id) !== id));
                toast.success(`Obra "${titulo}" eliminada correctamente.`);
            } catch (error) {
                console.error("Error deleting obra:", error);
                toast.error(`Error al eliminar "${titulo}".`);
            }
        }
    });
  }, []);

  const contextValue = useMemo(() => ({
    obrasList,
    loadingObras,
    handleCreateObra,
    handleUpdateObra,
    handleDeleteObra,
  }), [
    obrasList,
    loadingObras,
    handleCreateObra,
    handleUpdateObra,
    handleDeleteObra
  ]);

  return (
    <ObrasContext.Provider value={contextValue}>
      {children}
    </ObrasContext.Provider>
  );
};