// This component provides a button to switch between light, dark, and system themes.

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import config from '../../config';

/**
 * The ThemeSwitcher component allows users to toggle between light, dark, and system themes.
 */
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(config.theme.default);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || config.theme.default;
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <FaSun />;
      case 'dark':
        return <FaMoon />;
      case 'system':
        return <FaDesktop />;
    }
  };

  return (
    <button onClick={toggleTheme} className="bg-transparent border-none cursor-pointer text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300">
      {getThemeIcon()}
    </button>
  );
};

export default ThemeSwitcher;