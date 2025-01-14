// @perama: This component allows users to select the expiration time for uploaded files.
// It now uses custom CSS classes defined in globals.css for easier styling.

import React, { useEffect, useState } from 'react';
import config from '../../../config';
import { logError } from '../utils/clientLogUtil';

const ExpirationSelector = ({ expirationTime, setExpirationTime }) => {
  const [isDropdown, setIsDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDropdown(window.innerWidth < 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExpirationChange = (minutes) => {
    try {
      setExpirationTime(minutes);
      localStorage.setItem('expirationTime', minutes.toString());
    } catch (error) {
      logError('Error setting expiration time', { error: error.message }, 500);
    }
  };

  useEffect(() => {
    const savedExpiration = localStorage.getItem('expirationTime');
    if (savedExpiration) {
      setExpirationTime(parseInt(savedExpiration, 10));
    }
  }, [setExpirationTime]);

  const formatExpirationTime = (minutes) => {
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes === 60) return '1 hour';
    if (minutes < 1440) return `${minutes / 60} hours`;
    if (minutes === 1440) return '1 day';
    return `${minutes / 1440} days`;
  };

  return (
    <div className="expiration-selector">
      {isDropdown ? (
        <select
          className="expiration-dropdown"
          value={expirationTime}
          onChange={(e) => handleExpirationChange(parseInt(e.target.value, 10))}
        >
          {config.upload.expirationOptions.map((minutes) => (
            <option key={minutes} value={minutes}>
              {formatExpirationTime(minutes)}
            </option>
          ))}
        </select>
      ) : (
        <div className="expiration-buttons">
          {config.upload.expirationOptions.map((minutes, index) => (
            <React.Fragment key={minutes}>
              {index > 0 && <div className="expiration-separator">|</div>}
              <button
                onClick={() => handleExpirationChange(minutes)}
                className={`expiration-button ${expirationTime === minutes ? 'active' : ''}`}
              >
                {formatExpirationTime(minutes)}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpirationSelector;