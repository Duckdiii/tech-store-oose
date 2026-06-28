import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ts_theme') || 'light');
  const [lang,  setLang]  = useState(() => localStorage.getItem('ts_lang')  || 'vi');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ts_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ts_lang', lang);
  }, [lang]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, lang, setLang }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
