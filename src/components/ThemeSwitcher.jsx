// @perama: This component provides a button to switch between light, dark, and system themes.
// It also updates the theme in local storage and triggers a custom event for theme changes.

import React from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

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
    <button onClick={toggleTheme} className="bg-transparent border-none cursor-pointer text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300">
      {getThemeIcon()}
    </button>
  );
};

export default ThemeSwitcher;