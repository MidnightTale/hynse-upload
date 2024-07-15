import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import Logo_light from "/public/img/hynse_kaiiwa.svg";
import Logo_dark from "/public/img/hynse_kaiiwa_dark.svg";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <div>
      {theme === 'dark' ? (
        <Image src={Logo_dark} alt="Logo" width="800" height="256" priority />
      ) : (
        <Image src={Logo_light} alt="Logo" width="800" height="256" priority />
      )}
    </div>
  );
};

export default Logo;