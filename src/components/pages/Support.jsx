const Support = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
      <div className="rounded-xl bg-purple-900 bg-opacity-90 p-4 sm:p-8 shadow-lg">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-indigo-700 dark:text-purple-300">Soporte y Ayuda 🆘</h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
          Encuentra guías y soluciones a problemas comunes.
        </p>
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-lg sm:text-2xl font-semibold text-indigo-600 dark:text-purple-400">Preguntas Frecuentes (FAQ)</h3>
          <p>• ¿Cómo registro un nuevo personaje? <em>Solo los <strong>administradores</strong> pueden hacerlo a través del botón "Crear Nuevo".</em></p>
          <p>• Olvidé mi contraseña: <em>Actualmente, debes contactar a un administrador por Email.</em></p>
        </div>
      </div>
    </div>
  );
};

export default Support;