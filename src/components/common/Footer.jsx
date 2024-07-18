// This component renders the footer of the application, including various links.

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCoffee, FaGithub, FaDiscord, FaQuestionCircle } from 'react-icons/fa';
import Logo from '/public/img/hynse_kaiiwa.svg';
import ThemeSwitcher from './ThemeSwitcher';
import FAQ from './FAQ';
import TermsOfService from './TermsOfService';
import DMCAIPPolicy from './DMCAIPPolicy';

/**
 * The Footer component renders links to various pages and external resources.
 */
const Footer = () => {
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isTOSOpen, setIsTOSOpen] = useState(false);
  const [hasAcceptedTOS, setHasAcceptedTOS] = useState(false);
  const [isDMCAOpen, setIsDMCAOpen] = useState(false);

  useEffect(() => {
    const tosAccepted = localStorage.getItem('tosAccepted') === 'true';
    setHasAcceptedTOS(tosAccepted);
  }, []);

  const openFAQ = () => {
    setIsFAQOpen(true);
  };

  const openTOS = () => {
    setIsTOSOpen(true);
  };

  const openDMCAIPPolicy = () => {
    setIsDMCAOpen(true);
  };

  const handleTOSAccept = () => {
    setHasAcceptedTOS(true);
    localStorage.setItem('tosAccepted', 'true');
    setIsTOSOpen(false);
  };

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
          <a href="#" onClick={(e) => { e.preventDefault(); openFAQ(); }} className="footer-link">
            <FaQuestionCircle className="footer-icon" />
            <span className="footer-link-text">FAQ</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <a href="#" onClick={(e) => { e.preventDefault(); openTOS(); }} className="footer-bottom-link">Terms of Service</a>
          <a href="#" onClick={(e) => { e.preventDefault(); openDMCAIPPolicy(); }} className="footer-bottom-link">DMCA/IP Policy</a>
        </div>
        <div className="footer-bottom-iframe">
          <iframe src="https://ko-fi.com/streamalerts/goaloverlay/sa_bd9a46e4-66c2-4ec2-9726-dbcc2c2ec84e" width="100%" height="100" style={{ border: 'none' }}></iframe>
        </div>
      </div>
      <FAQ isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      <TermsOfService isOpen={isTOSOpen} onClose={() => setIsTOSOpen(false)} onAccept={handleTOSAccept} lastUpdated="2023-07-01" hasAccepted={hasAcceptedTOS} />
      <DMCAIPPolicy isOpen={isDMCAOpen} onClose={() => setIsDMCAOpen(false)} />
    </footer>
  );
};

export default Footer;