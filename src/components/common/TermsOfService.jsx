import React, { useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const TermsOfService = ({ isOpen, onClose, onAccept, lastUpdated }) => {
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
      className={`tos-overlay ${isOpen ? 'open' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="tos-card backdrop-blur-md bg-opacity-80 bg-history-item-background">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
        <p className="text-sm text-gray-500 mb-4">Last updated: {lastUpdated}</p>
        <div className="tos-content space-y-4 overflow-y-auto max-h-[60vh]">
          <p>1. Hey there! By using our cool file-sharing service, you're agreeing to play nice. No <span className="highlight-red">illegal or harmful stuff</span>, okay?</p>
          <p>2. We're doing our best, but we can't guarantee your files will be safe forever. Don't upload anything you can't bear to lose!</p>
          <p>3. Remember, your files are on a timer. Once that <span className="highlight-red">expiration time</span> hits, they're gone for good. No takebacks!</p>
          <p>4. If we spot anything fishy, we might have to remove it. Don't take it personally!</p>
          <p>5. Using our service is at your own risk. We're not responsible if things go sideways.</p>
          <p>6. We'll try to keep things running smoothly, but sometimes stuff happens. No promises on 24/7 availability.</p>
          <p>7. Those download links? They're your responsibility. Keep 'em secret, keep 'em safe!</p>
          <p>8. We might update these terms now and then. If you keep using the service, we'll assume you're cool with the changes.</p>
          <p>9. Don't try to break our service or use it for anything shady. We're all about sharing, not causing trouble.</p>
          <p>10. Respect other people's work! Don't upload stuff that belongs to someone else without permission.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onAccept}
            className="bg-primary-color text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors duration-200"
          >
            I Accept These Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;