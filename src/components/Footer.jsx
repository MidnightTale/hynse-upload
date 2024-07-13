// @perama: This component renders the footer of the application, including various links.
// It uses the Better Comments VSCode extension for improved readability.

import React from 'react';

/**
 * The Footer component renders links to various pages and external resources.
 * @returns {JSX.Element} The rendered Footer component
 */
const Footer = () => {
  // * Highlight: Using flexbox for responsive layout
  return (
    <footer className="flex justify-center space-x-4 p-4 bg-gray-800 text-white">
      {/* External links */}
      <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer" className="hover:underline">Ko-Fi</a>
      <a href="https://github.com/MidnightTale" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
      <a href="https://discord.gg/txn8QF9yDc" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
      
      {/* Internal links */}
      <a href="#" onClick={() => openFAQ()} className="hover:underline">FAQ</a>
      <a href="#" onClick={() => openTermsOfService()} className="hover:underline">Terms of Service</a>
      <a href="#" onClick={() => openAcceptableUsePolicy()} className="hover:underline">Acceptable Use Policy</a>
      <a href="#" onClick={() => openDMCAIPPolicy()} className="hover:underline">DMCA/IP Policy</a>
    </footer>
  );
};

// ! Alert: Ensure that the openFAQ, openTermsOfService, openAcceptableUsePolicy, and openDMCAIPPolicy functions are defined
// TODO: Implement the openFAQ, openTermsOfService, openAcceptableUsePolicy, and openDMCAIPPolicy functions
// @param openFAQ: Function to open the FAQ page
// @param openTermsOfService: Function to open the Terms of Service page
// @param openAcceptableUsePolicy: Function to open the Acceptable Use Policy page
// @param openDMCAIPPolicy: Function to open the DMCA/IP Policy page

export default Footer;