import { useNavigate } from 'react-router-dom';
import ObraForm from './ObraForm';

const ObraCreate = () => {
    const navigate = useNavigate();

    return (
        <div className="py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:text-purple-500 transition duration-150 flex items-center max-w-xl mx-auto"
            >
                &#x2190; Cancelar y Volver
            </button>
            
            <ObraForm />
        </div>
    );
};

export default ObraCreate;