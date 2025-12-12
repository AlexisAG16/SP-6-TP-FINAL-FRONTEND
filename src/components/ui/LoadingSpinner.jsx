const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center p-6 sm:p-10 min-h-[180px] sm:min-h-[300px]">
      <div 
        className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-4 rounded-full animate-spin border-indigo-500 border-t-transparent dark:border-purple-400 dark:border-t-transparent"
      >
      </div>
      <p className="mt-4 sm:mt-0 sm:ml-4 text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;