import { useTheme } from '../../hooks/useTheme'; 

const Footer = () => {
  const { theme } = useTheme(); 
  
  return (
    <footer className="w-full mt-auto py-4 text-center shadow-inner transition-colors duration-300 
      bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-purple-800">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Personajes Fantasticos | Powered by React
      </p>
      <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
        Current Theme: <span className="font-semibold">{theme.toUpperCase()}</span>
      </p>
    </footer>
  );
};

export default Footer;