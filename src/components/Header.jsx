// This component renders the header of the application, including the logo and theme switcher.

import React from 'react';
import Logo from './Logo';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * The Header component renders the application logo and theme switcher.
 */
const Header = () => {
  return (
    <header className="flex flex-col items-center p-4 bg-app-background relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="mb-4">
        <Logo />
      </div>
    </header>
  );
};

export default Header;