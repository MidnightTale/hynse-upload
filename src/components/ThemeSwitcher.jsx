import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.add('theme-transition');
    return () => {
      document.documentElement.classList.remove('theme-transition');
    };
  }, []);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <FaSun />;
      case 'dark':
        return <FaMoon />;
      case 'system':
      default:
        return <FaDesktop />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-transparent border-none cursor-pointer text-2xl theme-icon"
      aria-label="Toggle theme"
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeSwitcher;