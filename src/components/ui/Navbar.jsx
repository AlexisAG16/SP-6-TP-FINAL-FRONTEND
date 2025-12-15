import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CharactersContext } from '../context/CharactersContext';
import { AuthContext } from '../context/AuthContext'; 
import FavoritesModal from './FavoritesModal'; 

const Navbar = () => {
  const { isLoggedIn, user, logout, isAdmin } = useContext(AuthContext); 
  const { theme, toggleTheme, favorites } = useContext(CharactersContext); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const themeIcon = theme === 'light' ? '🌙' : '☀️';

  const linkClass = "block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-purple-400 font-semibold transition duration-150 py-1 px-3 rounded-md";
  const activeClass = "text-indigo-700 dark:text-purple-400 bg-gray-200 dark:bg-gray-700";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="shadow-lg sticky top-0 z-50 transition-colors duration-300 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-purple-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 dark:text-purple-400">
          Personajes Sobrenaturales
        </Link>

        <button
          className={`md:hidden flex items-center justify-center p-2 rounded border-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${menuOpen ? 'bg-indigo-100 dark:bg-purple-900 border-indigo-500 dark:border-purple-400' : 'bg-white dark:bg-gray-900 border-indigo-300 dark:border-purple-400'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke={menuOpen ? 'currentColor' : '#a78bfa'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        
        <div className={`flex-col md:flex-row md:flex space-y-2 md:space-y-0 md:space-x-4 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent shadow-xl md:shadow-none border-t-2 border-indigo-400 dark:border-purple-700 md:border-none rounded-b-xl transition-all duration-300 z-40 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
          <div className="flex flex-col w-full md:flex-row md:w-auto text-center">
            <NavLink 
              to="/characters" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''} border-b border-indigo-200 dark:border-purple-700 md:border-0 text-center`}
              onClick={() => setMenuOpen(false)}
            >
              Personajes
            </NavLink>
            {isAdmin && (
              <NavLink 
                to="/obras" 
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''} border-b border-indigo-200 dark:border-purple-700 md:border-0 text-center`}
                onClick={() => setMenuOpen(false)}
              >
                Obras
              </NavLink>
            )}
            <NavLink 
              to="/about-us" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''} border-b border-indigo-200 dark:border-purple-700 md:border-0 text-center`}
              onClick={() => setMenuOpen(false)}
            >
              Nosotros
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''} border-b border-indigo-200 dark:border-purple-700 md:border-0 text-center`}
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </NavLink>
            <NavLink 
              to="/support" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''} md:border-0 text-center`}
              onClick={() => setMenuOpen(false)}
            >
              Soporte
            </NavLink>
          </div>
          <div className="flex flex-row justify-center items-center w-full gap-4 my-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-150"
            >
              {themeIcon}
            </button>
            {(isLoggedIn || isAdmin) && (
              <button
                onClick={() => { setIsModalOpen(true); setMenuOpen(false); }}
                className="relative p-2 rounded-full text-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-150"
              >
                💖
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
            )}
          </div>
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden sm:inline">
                {user?.nombre} ({String(user?.rol || '').toUpperCase()})
              </span>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm" onClick={() => setMenuOpen(false)}>
                👤 Login
              </Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm" onClick={() => setMenuOpen(false)}>
                ✍️ Register
              </Link>
            </>
          )}
        </div>
      </div>
      <FavoritesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;