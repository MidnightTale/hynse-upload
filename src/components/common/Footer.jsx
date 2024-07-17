// This component renders the footer of the application, including various links.

import React from 'react';
import Image from 'next/image';
import { FaCoffee, FaGithub, FaDiscord, FaQuestionCircle } from 'react-icons/fa';
import Logo from '/public/img/hynse_kaiiwa.svg';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * The Footer component renders links to various pages and external resources.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Image src={Logo} alt="Logo" width={100} height={50} />
        </div>
        <div className="footer-links">
          <a href="https://ko-fi.com/midnighttale" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaCoffee className="footer-icon" />
            <span className="footer-link-text">Ko-Fi</span>
          </a>
          <a href="https://github.com/MidnightTale" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaGithub className="footer-icon" />
            <span className="footer-link-text">GitHub</span>
          </a>
          <a href="https://discord.gg/txn8QF9yDc" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaDiscord className="footer-icon" />
            <span className="footer-link-text">Discord</span>
          </a>
          <a href="#" onClick={() => openFAQ()} className="footer-link">
            <FaQuestionCircle className="footer-icon" />
            <span className="footer-link-text">FAQ</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <a href="#" onClick={() => openTermsOfService()} className="footer-bottom-link">Terms of Service</a>
          <a href="#" onClick={() => openAcceptableUsePolicy()} className="footer-bottom-link">Acceptable Use Policy</a>
          <a href="#" onClick={() => openDMCAIPPolicy()} className="footer-bottom-link">DMCA/IP Policy</a>
        </div>
        <div className="footer-bottom-iframe">
          <iframe src="https://ko-fi.com/streamalerts/goaloverlay/sa_bd9a46e4-66c2-4ec2-9726-dbcc2c2ec84e" width="100%" height="100" style={{ border: 'none' }}></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;