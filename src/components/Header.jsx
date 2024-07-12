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
    <header className="flex justify-between items-center p-4 bg-app-background">
      <Image
        src={Logo}
        alt="Hynse Logo"
        width={200}
        height={50}
        className="max-w-full h-[7vh] object-contain filter dark:brightness-100 light:brightness-25"
      />
      <ThemeSwitcher />
    </header>
  );
};

export default Header;