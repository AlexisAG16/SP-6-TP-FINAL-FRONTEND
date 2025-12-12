import React, { useState, useEffect, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ObrasContext } from '../../context/ObrasContext';

const initialFormState = { 
  titulo: '',
  tipo: '', // No hay valor por defecto, obliga a seleccionar
  anioPublicacion: '',
  imagenUrl: 'https://loremflickr.com/320/240/book,fantasy', 
  genero: '',
  sinopsis: '',
};

const validateForm = (form, obraToEdit = null) => {
  const currentYear = new Date().getFullYear();
  const errors = {};

  if (!form.titulo || !form.titulo.trim()) {
    errors.titulo = 'El título de la obra es obligatorio.';
  }
  if (!form.tipo || !form.tipo.trim()) {
    errors.tipo = 'El tipo de obra (Libro, Serie, etc.) es obligatorio.';
  }
  if (form.anioPublicacion && form.anioPublicacion.trim()) {
    const anio = parseInt(form.anioPublicacion);
    if (isNaN(anio) || anio < 1000 || anio > currentYear) {
      errors.anioPublicacion = `El año de publicación debe ser un valor numérico entre 1000 y ${currentYear}.`;
    }
  }

  if (form.genero && form.genero.trim() && form.genero.length < 2) {
    errors.genero = 'El género debe tener al menos 2 caracteres.';
  }

  if (form.sinopsis && String(form.sinopsis).length > 5000) {
    errors.sinopsis = 'La sinopsis excede el máximo de 5000 caracteres.';
  }

  const imagenVal = String(form.imagenUrl || '').trim();
  const isUrl = /^https?:\/\//i.test(imagenVal);

  const isLocalPath = imagenVal.includes('images') || imagenVal.includes('public') || imagenVal.startsWith('/') || imagenVal.startsWith('./') || imagenVal.startsWith('../');


  if (imagenVal && !isUrl && !isLocalPath) {
    errors.imagenUrl = 'La URL o ruta de la imagen de portada no es válida (ej: /images/obras/crepusculo.jpg o https://ejemplo.com/image.jpg).';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};


const ObraForm = ({ obraToEdit }) => { 
  const { handleCreateObra, handleUpdateObra } = useContext(ObrasContext);
  const navigate = useNavigate(); 
  
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedTypes = [
    'PELICULA', 'LIBRO/SAGA', 'PELICULA/SAGA', 'SERIE', 'LIBRO/PELICULA/SAGA', 'PELICULA/LIBRO', 'OTROS'
  ];

  const obraId = obraToEdit?._id || obraToEdit?.id; 

  useEffect(() => {
    if (obraToEdit) {

      const rawTipo = obraToEdit.tipo || obraToEdit.tipo_obra || '';
      const normalizedTipo = allowedTypes.includes(rawTipo) ? rawTipo : 'Otros';
      if (rawTipo && !allowedTypes.includes(rawTipo)) {
        console.warn(`ObraForm: tipo '${rawTipo}' no es válido según enum; se sustituye por 'Otros'`);
      }

      setForm({
        titulo: obraToEdit.titulo || '',
        tipo: normalizedTipo,
        anioPublicacion: String(obraToEdit.anioPublicacion ?? obraToEdit.anio_publicacion ?? ''),
        imagenUrl: obraToEdit.imagen || obraToEdit.imagenUrl || '',
        genero: obraToEdit.genero || '',
        sinopsis: obraToEdit.sinopsis || '',
      });
    }
  }, [obraToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { isValid, errors: validationErrors } = validateForm(form, obraToEdit);

    if (!isValid) {
      setErrors(validationErrors);
      const first = Object.values(validationErrors)[0];
      if (first) toast.error(first);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    const rawData = {
      ...form,
      anioPublicacion: parseInt(form.anioPublicacion),
    };

    const tituloSan = DOMPurify.sanitize(String(rawData.titulo || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const tipoSan = DOMPurify.sanitize(String(rawData.tipo || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const generoSan = DOMPurify.sanitize(String(rawData.genero || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const sinopsisSan = DOMPurify.sanitize(String(rawData.sinopsis || '').trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const imagenValLocal = String(form.imagenUrl || '').trim();
    const dataToSend = {
      titulo: tituloSan,
      tipo_obra: tipoSan,
      anio_publicacion: isNaN(rawData.anioPublicacion) ? undefined : rawData.anioPublicacion,
      genero: generoSan,
      sinopsis: sinopsisSan,
      ...(imagenValLocal ? { imagen: imagenValLocal } : {}),
    };

    let success = false;

    try {
      if (obraToEdit) {
        if (!dataToSend.imagen) dataToSend.imagen = obraToEdit.imagen || undefined;
        success = await handleUpdateObra(obraId, dataToSend);
        if (success) toast.success('Obra actualizada con éxito.');
      } else {
        // Crear
        success = await handleCreateObra(dataToSend);
        if (success) toast.success('Obra creada con éxito.');
      }

      if (success) {
        navigate('/obras');
      } else {
        toast.error('No se pudo guardar la obra. Revisa los mensajes del servidor.');
      }
    } catch (err) {
      console.error('Error inesperado en el submit de ObraForm:', err);
      toast.error('Ocurrió un error inesperado al guardar. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition duration-150";
  const labelClass = "block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2";

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-300 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 z-30 flex items-center justify-center rounded-xl">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-indigo-600 dark:border-purple-400"></div>
        </div>
      )}
      <h2 className="text-3xl font-extrabold text-center mb-8 
        text-indigo-600 dark:text-purple-400">
        {obraToEdit ? `Editar Obra: ${obraToEdit.titulo}` : 'Registrar Nueva Obra'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="titulo" className={labelClass}>Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Crónicas Vampíricas"
          />
          {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
        </div>

        <div>
          <label htmlFor="tipo" className={labelClass}>Tipo de Obra *</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className={inputClass + " appearance-none"}
          >
            <option value="" disabled>Seleccione un tipo de obra</option>
            <option value="PELICULA">Película</option>
            <option value="LIBRO/SAGA">Libro/Saga</option>
            <option value="PELICULA/SAGA">Película/Saga</option>
            <option value="SERIE">Serie</option>
            <option value="LIBRO/PELICULA/SAGA">Libro/Película/Saga</option>
            <option value="PELICULA/LIBRO">Película/Libro</option>
            <option value="OTROS">Otros (Juego, Cómic, Manga, etc.)</option>
          </select>
          {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
        </div>

        <div>
          <label htmlFor="anioPublicacion" className={labelClass}>Año de Publicación</label>
          <input
            type="number"
            id="anioPublicacion"
            name="anioPublicacion"
            value={form.anioPublicacion}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: 1997"
            min="1000"
            max={new Date().getFullYear()}
          />
          {errors.anioPublicacion && <p className="text-red-500 text-xs mt-1">{errors.anioPublicacion}</p>}
        </div>

        <div>
          <label htmlFor="imagenUrl" className={labelClass}>Imagen URL de Portada</label>
          <input
            type="text"
            id="imagenUrl"
            name="imagenUrl"
            value={form.imagenUrl}
            onChange={handleChange}
            
            className={inputClass}
            placeholder="https://ejemplo.com/portada.jpg o /images/obras/archivo.jpg"
          />
          {errors.imagenUrl && <p className="text-red-500 text-xs mt-1">{errors.imagenUrl}</p>}

          {form.imagenUrl && (
            <div className="mt-4 border border-gray-300 dark:border-gray-600 rounded p-2 text-center">
                <img 
                    src={form.imagenUrl} 
                    alt="Preview de Portada" 
                    className="max-h-40 w-auto mx-auto object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/374151/ffffff?text=X"}}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preview</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="genero" className={labelClass}>Género</label>
          <input
            type="text"
            id="genero"
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Fantasía, Terror, Aventura"
          />
        </div>

        <div>
          <label htmlFor="sinopsis" className={labelClass}>Sinopsis</label>
          <textarea
            id="sinopsis"
            name="sinopsis"
            value={form.sinopsis}
            onChange={handleChange}
            className={inputClass + ' h-24 resize-none'}
            placeholder="Breve sinopsis de la obra..."
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div>{errors.sinopsis ? <span className="text-red-500">{errors.sinopsis}</span> : <span>&nbsp;</span>}</div>
            <div>{String(form.sinopsis || '').length}/5000</div>
          </div>
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
          {isSubmitting ? 'Guardando...' : (obraToEdit ? 'Actualizar Obra' : 'Registrar Obra')}
        </button>

        <button
          type="button"
          onClick={() => navigate('/obras')}
          className="w-full mt-4 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold rounded transition duration-150"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ObraForm;