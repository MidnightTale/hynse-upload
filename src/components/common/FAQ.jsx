// src/components/common/FAQ.jsx
import React, { useEffect, useRef } from 'react';
import { FaQuestion, FaInfoCircle } from 'react-icons/fa';

const FAQ = ({ isOpen, onClose }) => {
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
      className={`faq-overlay ${isOpen ? 'open' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className="faq-card">
        <div className="faq-close" onClick={onClose}>&times;</div>
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">What's this all about?</span>
            </h3>
            <p className="faq-answer">
              It's a temporary file storage service. Perfect for when you don't want to clutter your disk space or need to share something anonymously that'll vanish after a while. Pretty nifty, right?
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">How big can my files be?</span>
            </h3>
            <p className="faq-answer">
              You can upload files up to 1 GB in size. That's a lot of cat pictures!
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">How long do you keep my stuff?</span>
            </h3>
            <p className="faq-answer">
              Your files stick around based on the expiration time you pick when uploading. Once that time's up, they're gone for good. No exceptions!
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Oops! I uploaded something by mistake. Can I take it back?</span>
            </h3>
            <p className="faq-answer">
              Accidents happen! If you need a file removed pronto, shoot me a message on Discord. I'll do my best to zap it ASAP.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Is my data safe with you?</span>
            </h3>
            <p className="faq-answer">
              I take security seriously. Your uploads are encrypted, and I don't peek at your files. But hey, it's the internet - don't upload anything super sensitive, okay? Also, I store your IP address with your uploads to prevent abuse.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">What's off-limits for uploads?</span>
            </h3>
            <p className="faq-answer">
              No illegal stuff, malware, or explicit content. I'm not into that, and I don't want legal headaches. Specifically, I don't allow .exe, .scr, .cpl, .doc*, or .jar files. Check the Terms of Service for the full no-no list.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Can I delete my file before it expires?</span>
            </h3>
            <p className="faq-answer">
              Sorry, no DIY deletions at the moment. If you need something gone early, drop me a line and I'll handle it.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">What's your take on copyright stuff?</span>
            </h3>
            <p className="faq-answer">
              I respect intellectual property. If you think someone's uploaded your copyrighted work without permission, let me know with a DMCA takedown request through the Discord support server.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">How can I get support or report issues?</span>
            </h3>
            <p className="faq-answer">
              Join our Discord support server! It's the best place to get help, report problems, or just chat about the service. I'm usually hanging out there, ready to assist.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Can I support this service?</span>
            </h3>
            <p className="faq-answer">
              Absolutely! This service runs on love and server costs. If you find it useful, consider making a small donation. It helps keep the lights on and the files flowing. Every bit helps cover server expenses and keeps this project alive. Check out the donation link in the footer!
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">
              <FaQuestion className="inline-block mr-2 text-primary-color" />
              <span className="text-primary-color">Will this project be open-sourced?</span>
            </h3>
            <p className="faq-answer">
              I'm considering it! The code's a bit of a spaghetti monster right now, and there are still some missing features and potential bugs. I want to clean things up before sharing it with the world. If you're brave and want to try it out, go for it, but use at your own risk for now. Keep an eye out for updates – I'll announce when a stable, open-source version is ready!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;