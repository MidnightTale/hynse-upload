// @perama: This component allows users to select the expiration time for uploaded files.
// It now uses custom CSS classes defined in globals.css for easier styling.

import React from 'react';
import config from '../../../config';
import { logError } from '../utils/clientLogUtil';

const ExpirationSelector = ({ expirationTime, setExpirationTime }) => {
  const handleExpirationChange = (minutes) => {
    try {
      setExpirationTime(minutes);
    } catch (error) {
      logError('Error setting expiration time', { error: error.message }, 500);
    }
  };

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
    </div>
  );
};

export default ExpirationSelector;