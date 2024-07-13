// This component renders the header of the application, including the logo and theme switcher.

import React from 'react';
import Image from 'next/image';
import Logo from "/public/img/hynse_long.png";
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
        <Image
          src={Logo}
          alt="Hynse Logo"
          width={500}
          height={125}
          className="max-w-full h-auto object-contain [filter:var(--logo-filter)] [image-rendering:_pixelated]"
        />
      </div>
    </header>
  );
};

export default Header;