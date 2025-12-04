import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'light'); 

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#1e1e2e'; 
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f3f4f6'; 
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}