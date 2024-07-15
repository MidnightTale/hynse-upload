// This component renders the footer of the application, including various links.

import React from 'react';
import Image from 'next/image';
import Logo from '/public/img/hynse_long.png';

/**
 * The Footer component renders links to various pages and external resources.
 */
const Footer = () => {
  return (
    <footer className="m-4 sm:m-6 md:m-8 lg:m-12 p-4 sm:p-6 md:p-8 lg:p-12 bg-[var(--footer-background)] text-[var(--footer-text-color)] rounded-lg shadow-[0_0_0_1px_var(--footer-border-color),0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" width={100} height={50} />
        </div>
        <div className="flex space-x-4">
          <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer" className="hover:underline">Ko-Fi</a>
          <a href="https://github.com/MidnightTale" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          <a href="https://discord.gg/txn8QF9yDc" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
          <a href="#" onClick={() => openFAQ()} className="hover:underline">FAQ</a>
        </div>
      </div>
      <hr className="border-[var(--footer-border-color)] my-4" />
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="#" onClick={() => openTermsOfService()} className="hover:underline">Terms of Service</a>
          <a href="#" onClick={() => openAcceptableUsePolicy()} className="hover:underline">Acceptable Use Policy</a>
          <a href="#" onClick={() => openDMCAIPPolicy()} className="hover:underline">DMCA/IP Policy</a>
        </div>
        <div className="text-right">
          <iframe src="https://ko-fi.com/streamalerts/goaloverlay/sa_bd9a46e4-66c2-4ec2-9726-dbcc2c2ec84e" width="100%" height="100" style={{ border: 'none' }}></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;