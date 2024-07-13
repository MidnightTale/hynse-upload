// @perama: This component renders the header of the application, including the logo and theme switcher.
// It uses the Better Comments VSCode extension for improved readability.

import React from 'react';
import Image from 'next/image';
import Logo from "/public/img/hynse_long.png";
import ThemeSwitcher from './ThemeSwitcher';

/**
 * The Header component renders the application logo and theme switcher.
 * @returns {JSX.Element} The rendered Header component
 */
const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-app-background">
      {/* * Highlight: Logo image with responsive sizing and theme-based brightness */}
      <Image
        src={Logo}
        alt="Hynse Logo"
        width={200}
        height={50}
        className="max-w-full h-[7vh] object-contain filter dark:brightness-100 light:brightness-25"
      />
      
      {/* * Highlight: Theme switcher component for toggling between light and dark modes */}
      <ThemeSwitcher />
      
      {/* ! Alert: Ensure that the ThemeSwitcher component is properly implemented */}
      {/* TODO: Add accessibility features to the header, such as aria labels */}
      {/* @param src: The source path for the logo image */}
      {/* @param alt: Alternative text for the logo image for accessibility */}
    </header>
  );
};

export default Header;