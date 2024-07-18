// This component renders the header of the application, including the logo.

import React, { useState } from 'react';
import Image from 'next/image';
import Logo from "/public/img/hynse_kaiiwa.svg";
import FAQ from './FAQ';

/**
 * The Header component renders the application logo.
 */
const Header = () => {
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const openFAQ = (e) => {
    e.preventDefault();
    setIsFAQOpen(true);
  };

  return (
    <header className="flex flex-col items-center p-4 relative">
      <div className="mb-4">
        <Image
          src={Logo}
          alt="Hynse Logo kawaii"
          width={680}
          height={256}
          className="max-w-full h-auto object-contain"
          priority
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Temporary uploads up to 1 GB are allowed. You should read the <a href="#" onClick={openFAQ} className="primary-link hover:underline">FAQ</a>.
        </p>
      </div>
      <FAQ isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </header>
  );
};

export default Header;