// This component renders the footer of the application, including various links.

import React from 'react';
import styles from '../styles/Footer.module.css';

/**
 * The Footer component renders links to various pages and external resources.
 */
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer">Ko-Fi</a>
      <a href="https://github.com/MidnightTale" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://discord.gg/txn8QF9yDc" target="_blank" rel="noopener noreferrer">Discord</a>
      <a href="#" onClick={() => openFAQ()}>FAQ</a>
      <a href="#" onClick={() => openTermsOfService()}>Terms of Service</a>
      <a href="#" onClick={() => openAcceptableUsePolicy()}>Acceptable Use Policy</a>
      <a href="#" onClick={() => openDMCAIPPolicy()}>DMCA/IP Policy</a>
    </footer>
  );
};

export default Footer;