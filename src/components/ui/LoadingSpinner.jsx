const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex justify-center items-center p-10 min-h-[300px]">
      <div 
        className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin 
        border-indigo-500 border-t-transparent 
        dark:border-purple-400 dark:border-t-transparent"
      >
      </div>
      
      <p className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;