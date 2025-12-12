const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
      <div className="rounded-xl bg-purple-900 bg-opacity-90 p-4 sm:p-8 shadow-lg">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-indigo-700 dark:text-purple-300">Contáctanos 📞</h2>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400">
          Si tienes preguntas o sugerencias sobre nuestra base de datos, no dudes en contactar a nuestro equipo de la Orden Secreta.
        </p>
        <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300">
          <li>📧 <strong>Email:</strong> soporte@personajessobrenaturales.com</li>
          <li>📍 <strong>Sede Central:</strong> El Bosque Prohibido, Sección G.</li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;