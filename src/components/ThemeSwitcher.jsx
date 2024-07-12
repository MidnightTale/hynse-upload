// This component provides a button to switch between light and dark themes.

import React, { useState, useEffect } from 'react';
import styles from '../styles/ThemeSwitcher.module.css';

/**
 * The ThemeSwitcher component allows users to toggle between light and dark themes.
 */
const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="bg-transparent border-none cursor-pointer text-2xl text-text-color hover:text-primary-color transition-colors duration-300">
      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
    </button>
  );
};

export default ThemeSwitcher;