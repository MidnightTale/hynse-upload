// @perama: This component provides a button to switch between light, dark, and system themes.
// It also updates the theme in local storage and triggers a custom event for theme changes.

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import config from '../../config';

/**
 * The ThemeSwitcher component allows users to toggle between light, dark, and system themes.
 * @returns {JSX.Element} The rendered ThemeSwitcher component
 */
const ThemeSwitcher = () => {
  // * Highlight: State to keep track of the current theme
  const [theme, setTheme] = useState(config.theme.default);

  useEffect(() => {
    // * Highlight: Load the saved theme from localStorage or use the default theme
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
      // * Highlight: Detect system preference for dark mode
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(systemTheme);
      localStorage.setItem('theme', systemTheme);
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    }
    // ! Alert: Ensure that other components are listening for this event
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

  // TODO: Add accessibility features such as aria-label to the button
  return (
    <button
      onClick={toggleTheme}
      className="bg-transparent border-none cursor-pointer text-2xl text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors duration-300"
      aria-label={`Toggle theme to ${theme === 'system' ? 'system' : theme === 'light' ? 'light' : 'dark'}`}
    >
      {getThemeIcon()}
    </button>
  );
};

// @param theme: The current theme ('light', 'dark', or 'system')
// @param setTheme: Function to update the theme state
// @param applyTheme: Function to apply the selected theme to the document
// @param toggleTheme: Function to cycle through available themes
// @param getThemeIcon: Function to get the appropriate icon for the current theme

export default ThemeSwitcher;