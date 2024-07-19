import React, { useRef, useEffect } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';

const TermsOfService = ({ isOpen, onClose, onAccept, lastUpdated, hasAccepted }) => {
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
          {tosItems.map((item, index) => (
            <div key={index} className="tos-item">
              <h3 className="tos-section">
                <FaInfoCircle className="inline-block mr-2 text-primary-color" />
                <span className="text-primary-color">{item.title}</span>
              </h3>
              <p className="tos-content">{item.content}</p>
            </div>
          ))}
          <div className="tos-item">
            <h3 className="tos-section">
              <FaInfoCircle className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Consequences of Violation</span>
            </h3>
            <p className="tos-content">
              Breaking these rules isn't cool, folks. If you violate these terms, I'll have to take action. This could mean <span className="highlight-red">immediate blocking of your IP address</span> from using my service. I don't have user accounts, so it's a one-strike policy. Play nice, and we'll all have a good time!
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          {!hasAccepted && (
            <button
              onClick={onAccept}
              className="bg-primary-color text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors duration-200"
            >
              I Accept These Terms
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const tosItems = [
  {
    title: "The Basics",
    content: "Hey there! By using my cool file-sharing service, you're agreeing to play nice. No illegal or harmful stuff, okay?"
  },
  {
    title: "File Safety",
    content: "I'm doing my best, but I can't guarantee your files will be safe forever. Don't upload anything you can't bear to lose!"
  },
  {
    title: "Expiration",
    content: "Remember, your files are on a timer. Once that expiration time hits, they're gone for good. No takebacks!"
  },
  {
    title: "Content Removal",
    content: "If I spot anything fishy, I might have to remove it. Don't take it personally!"
  },
  {
    title: "Use at Your Own Risk",
    content: "Using my service is at your own risk. I'm not responsible if things go sideways."
  },
  {
    title: "Availability",
    content: "I'll try to keep things running smoothly, but sometimes stuff happens. No promises on 24/7 availability."
  },
  {
    title: "Download Links",
    content: "Those download links? They're your responsibility. Keep 'em secret, keep 'em safe!"
  },
  {
    title: "Updates to Terms",
    content: "I might update these terms now and then. If you keep using the service, I'll assume you're cool with the changes."
  },
  {
    title: "No Funny Business",
    content: "Don't try to break my service or use it for anything shady. I'm all about sharing, not causing trouble."
  },
  {
    title: "Respect Copyright",
    content: "Respect other people's work! Don't upload stuff that belongs to someone else without permission."
  }
];

export default TermsOfService;