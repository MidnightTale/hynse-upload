// This component renders the footer of the application, including various links.

import React from 'react';

/**
 * The Footer component renders links to various pages and external resources.
 */
const Footer = () => {
  return (
    <footer className="flex justify-center space-x-4 p-4 bg-gray-800 text-white">
      <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer" className="hover:underline">Ko-Fi</a>
      <a href="https://github.com/MidnightTale" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
      <a href="https://discord.gg/txn8QF9yDc" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
      <a href="#" onClick={() => openFAQ()} className="hover:underline">FAQ</a>
      <a href="#" onClick={() => openTermsOfService()} className="hover:underline">Terms of Service</a>
      <a href="#" onClick={() => openAcceptableUsePolicy()} className="hover:underline">Acceptable Use Policy</a>
      <a href="#" onClick={() => openDMCAIPPolicy()} className="hover:underline">DMCA/IP Policy</a>
    </footer>
  );
};

export default Footer;