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

  const linkClass = "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-purple-400 font-semibold transition duration-150 py-1 px-3 rounded-md";
  const activeClass = "text-indigo-700 dark:text-purple-400 bg-gray-200 dark:bg-gray-700";

  return (
    <nav className="shadow-lg sticky top-0 z-50 transition-colors duration-300 
    bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-purple-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-extrabold 
          text-indigo-600 dark:text-purple-400">
          Personajes Sobrenaturales
        </Link>

        <div className="flex space-x-4 items-center">
          
            <NavLink 
              to="/characters" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
          >
              Personajes
          </NavLink>
            {isAdmin && (
              <NavLink 
                to="/obras" 
                className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
              >
                Obras
              </NavLink>
            )}
          <NavLink 
              to="/about-us" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
          >
              Nosotros
          </NavLink>
          <NavLink 
              to="/contact" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
          >
              Contacto
          </NavLink>
          <NavLink 
              to="/support" 
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ''}`}
          >
              Soporte
          </NavLink>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-150"
          >
            {themeIcon}
          </button>
          
            {(isLoggedIn || isAdmin) && (
            <button
              onClick={() => setIsModalOpen(true)}
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
          
          {isLoggedIn ? (
             <>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden sm:inline">
                  {user?.nombre} ({String(user?.rol || '').toUpperCase()})
                </span>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm"
                >
                    🚪 Logout
                </button>
            </>
          ) : (
            <>
                <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm">
                    👤 Login
                </Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-sm">
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