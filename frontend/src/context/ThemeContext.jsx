import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
      return;
    }

    // No saved preference: detect system preference on first load
    if (window.matchMedia) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mql.matches ? 'dark' : 'light');
      // Listen for system changes and update only if user has not set a preference
      const onChange = (e) => {
        const stillSaved = localStorage.getItem('theme');
        if (!stillSaved) setTheme(e.matches ? 'dark' : 'light');
      };
      try {
        mql.addEventListener('change', onChange);
      } catch (e) {
        mql.addListener(onChange);
      }
      return () => {
        try { mql.removeEventListener('change', onChange); } catch (e) { mql.removeListener(onChange); }
      };
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    document.body.style.transition = 'background-color 300ms ease, color 300ms ease';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
