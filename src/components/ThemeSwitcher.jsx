// @perama: This component provides a button to switch between light, dark, and system themes.
// It also updates the theme in local storage and triggers a custom event for theme changes.

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

  /**
   * Apply the selected theme to the document and trigger a custom event.
   * @param {string} newTheme - The new theme to apply.
   */
  const applyTheme = (newTheme) => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
      localStorage.setItem('theme', systemTheme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    }
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * Toggle between themes and apply the new theme.
   */
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  /**
   * Get the appropriate icon for the current theme.
   * @returns {JSX.Element} The theme icon component.
   */
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