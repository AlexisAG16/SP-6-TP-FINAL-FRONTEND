import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative w-full h-[86vh] flex items-center justify-center">
      <img
        src="/images/bosque.jpg"
        alt="Bosque"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl px-8 py-12 bg-transparent">
        <div className="flex-1 text-center">
          <h1 className="text-6xl font-extrabold text-white dark:text-white mb-4">
            Personajes <span className="text-purple-400 dark:text-indigo-300">Sobrenaturales</span>
          </h1>
          <p className="text-lg text-white dark:text-gray-200 mb-8">
            Explora la base de datos más completa de magos, vampiros, brujas y licántropos.
          </p>
          <Link
            to="/characters"
            className="inline-block bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded transition"
          >
            Explorar Personajes
          </Link>
        </div>
        <motion.img
          src="/images/draculaht.png"
          alt="Drácula"
          className="flex-1 max-h-[750px] object-contain p-20"
          initial={{ y: 0 }}
          animate={{ y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </section>
    </main>
  );
}