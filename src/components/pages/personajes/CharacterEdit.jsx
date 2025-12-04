import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../../../api/CharacterApi';
import CharacterForm from './CharacterForm';
import LoadingSpinner from '../../ui/LoadingSpinner';

const CharacterEdit = () => {
    const { id } = useParams();
    const [characterToEdit, setCharacterToEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacter = async () => {
            setLoading(true);
            try {
                const { data } = await getCharacterById(id);
                setCharacterToEdit(data);
            } catch {
                setCharacterToEdit(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacter();
    }, [id]);

    if (loading) return <LoadingSpinner message="Cargando personaje..." />;
    if (!characterToEdit) {
        return <Navigate to="/characters" replace />;
    }

    return (
        <div className="py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:bg-purple-500 transition duration-150 flex items-center max-w-xl mx-auto"
            >
                &#x2190; Cancelar y Volver
            </button>

            <CharacterForm characterToEdit={characterToEdit} />
        </div>
    );
};

export default CharacterEdit;