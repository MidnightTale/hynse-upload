import React, { useEffect, useRef } from 'react';
import { FaTimes, FaCopyright } from 'react-icons/fa';

const DMCAIPPolicy = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className={`dmca-overlay ${isOpen ? 'open' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="dmca-card backdrop-blur-md bg-opacity-80 bg-history-item-background">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">DMCA/IP Policy</h2>
        <div className="dmca-content space-y-4 overflow-y-auto max-h-[60vh]">
          <p>
            <FaCopyright className="inline-block mr-2 text-primary-color" />
            <span className="text-primary-color">Hey there, copyright enthusiasts!</span>
          </p>
          <p>
            I'm all about respecting intellectual property. If you think someone's uploaded your work without permission, let me know, and I'll check it out.
          </p>
          <p>
            Here's what I need from you to handle a <span className="highlight-red">DMCA takedown request</span>:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A description of what's been copied (your awesome creation).</li>
            <li>Where on the site you found the infringing material (the file ID or URL).</li>
            <li>Your contact info (so I can reach out if needed).</li>
            <li>A statement that you believe in good faith that the use isn't authorized.</li>
            <li>A statement that the info in your notice is accurate, and that you're the copyright owner or authorized to act on their behalf (under penalty of perjury - serious stuff!).</li>
          </ul>
          <p>
            Send your takedown requests through the <span className="highlight-red">Discord support server</span>. I'll do my best to respond quickly and remove any infringing content.
          </p>
          <p>
            Remember, false claims are not cool. Make sure you're the real deal before sending a takedown notice.
          </p>
          <p>
            <span className="highlight-red">Important:</span> This server doesn't have user accounts. If someone is found to be violating copyright or any other policies, their <span className="highlight-red">IP address will be instantly blocked</span> from using the service. No warnings, no second chances - it's a one-strike policy to keep things fair and legal for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DMCAIPPolicy;