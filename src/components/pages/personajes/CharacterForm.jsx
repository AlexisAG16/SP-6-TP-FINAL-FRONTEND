import React, { useState, useEffect, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CharactersContext } from '../../context/CharactersContext'; 
import { ObrasContext } from '../../context/ObrasContext';

const initialFormState = { 
  nombre: '',
  tipo: '',
  obra: '', 
  clasificacion: 'Protagonista', 
  imagen: 'https://loremflickr.com/320/240/fantasy', 
  poderes: '',
  descripcion: ''
};

const CharacterForm = ({ characterToEdit }) => {
  const { handleCreate, handleUpdate } = useContext(CharactersContext);
  const { obrasList, loadingObras } = useContext(ObrasContext);
  const navigate = useNavigate(); 
  
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (characterToEdit) {
      setForm({
        ...characterToEdit,
        obra: (characterToEdit.obra && (characterToEdit.obra._id || characterToEdit.obra)) || '',
        poderes: Array.isArray(characterToEdit.poderes) ? characterToEdit.poderes.join(', ') : characterToEdit.poderes || '',
        descripcion: characterToEdit.descripcion || ''
      });
    }
  }, [characterToEdit]);

  // Manejador genérico de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    setIsSubmitting(true);
    // Preparar datos para el backend
    const dataToSend = {
      ...form,
      poderes: form.poderes.split(',').map(p => p.trim()).filter(p => p.length > 0),
    };
    dataToSend.nombre = DOMPurify.sanitize(String(dataToSend.nombre || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    dataToSend.tipo = DOMPurify.sanitize(String(dataToSend.tipo || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    dataToSend.descripcion = DOMPurify.sanitize(String(dataToSend.descripcion || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    dataToSend.poderes = dataToSend.poderes.map(p => DOMPurify.sanitize(String(p), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }));
    try {
      if (characterToEdit && (!form.imagen || !form.imagen.trim())) {
        dataToSend.imagen = characterToEdit.imagen || '';
      }
      if (characterToEdit) {
        await handleUpdate(characterToEdit._id, dataToSend);
        toast.success(`Personaje ${form.nombre} actualizado con éxito.`);
        navigate('/characters');
      } else {
        const result = await handleCreate(dataToSend);
        if (result !== false) {
          toast.success(`¡Personaje ${form.nombre} creado con éxito!`);
          setForm(initialFormState);
          navigate('/characters');
        }
        // Si result === false, el error ya fue mostrado por handleCreate y no se navega
      }
    } catch (error) {
      // Mostrar mensaje de error del backend si existe
      const backendMsg = error?.response?.data?.message;
      if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error(`Error al ${characterToEdit ? 'actualizar' : 'crear'} el personaje.`);
      }
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mostrar un mensaje de carga si la lista de obras aún se está cargando
  if (loadingObras) return <p className="text-center dark:text-gray-300">Cargando opciones de obras...</p>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-xl relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 z-30 flex items-center justify-center rounded-xl">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-indigo-600 dark:border-purple-400"></div>
        </div>
      )}
      <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700 dark:text-purple-400">
        {characterToEdit ? 'Editar Personaje' : 'Crear Nuevo Personaje'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            // required eliminado para permitir validación backend
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
          />
          {errors.nombre && <p className="text-red-500 text-xs italic mt-1">{errors.nombre}</p>}
        </div>

        {/* Tipo (select enum) */}
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            // required eliminado para permitir validación backend
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 appearance-none"
          >
            <option value="" disabled>Selecciona un tipo...</option>
            <option value="Vampiro">Vampiro</option>
            <option value="Bruja">Bruja</option>
            <option value="Mago">Mago</option>
            <option value="Licántropo">Licántropo</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.tipo && <p className="text-red-500 text-xs italic mt-1">{errors.tipo}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="obra" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Obra (Película o Serie) *
          </label>
          <select
            id="obra"
            name="obra"
            value={form.obra}
            onChange={handleChange}
            // required eliminado para permitir validación backend
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 appearance-none"
          >
            <option value="" disabled>Selecciona una Obra...</option>
            {obrasList.map((media) => (
              // El valor enviado al backend debe ser el ID de la obra
              <option key={media._id} value={media._id}>
                {media.titulo} ({media.anioPublicacion || media.anio_publicacion || 'N/A'})
              </option>
            ))}
          </select>
          {errors.obra && <p className="text-red-500 text-xs italic mt-1">{errors.obra}</p>}
        </div>

        {/* URL de Imagen */}
        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">URL de Imagen</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            // required eliminado para permitir validación backend
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
            placeholder="https://ejemplo.com/imagen.jpg o /images/personajes/archivo.jpg"
          />
          {errors.imagen && <p className="text-red-500 text-xs italic mt-1">{errors.imagen}</p>}
          {form.imagen && (
            <div className="mt-4 border border-gray-300 dark:border-gray-600 rounded p-2 text-center">
              <img
                src={form.imagen}
                alt="Preview de Personaje"
                className="max-h-40 w-auto mx-auto object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/374151/ffffff?text=X"; }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preview</p>
            </div>
          )}
        </div>

        {/* Poderes */}
        <div className="mb-4">
          <label htmlFor="poderes" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Poderes (separados por coma)
          </label>
          <textarea
            id="poderes"
            name="poderes"
            value={form.poderes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
            rows="3"
            placeholder="Ej: Inmortalidad, Vuelo, Hipnosis"
          />
        </div>

        {/* Descripción (textarea grande) */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 h-32 resize-vertical"
            placeholder="Descripción larga del personaje..."
          />
          {errors.descripcion && <p className="text-red-500 text-xs italic mt-1">{errors.descripcion}</p>}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-end">{String(form.descripcion || '').length}/5000</div>
        </div>

        {/* Clasificación */}
        <div className="mb-4">
          <label htmlFor="clasificacion" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Clasificación</label>
          <select
            id="clasificacion"
            name="clasificacion"
            value={form.clasificacion}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 appearance-none"
          >
            <option value="Protagonista">Protagonista</option>
            <option value="Antagonista">Antagonista</option>
            <option value="Aliado">Aliado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded font-bold transition duration-150 ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? 'Guardando...' : (characterToEdit ? 'Actualizar Personaje' : 'Crear Personaje')}
        </button>

        <button
          type="button"
          onClick={() => navigate('/characters')}
          className="w-full mt-4 py-3 px-4 rounded font-bold transition text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CharacterForm;