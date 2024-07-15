// @perama: This component allows users to select the expiration time for uploaded files.
// It now uses custom CSS classes defined in globals.css for easier styling.

import React from 'react';
import config from '../../../config';
import { logError } from '../clientLogUtil';

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
      <label htmlFor="expiration" className="expiration-label">
        Select expiration time:
      </label>
      <div className="expiration-buttons">
        {config.upload.expirationOptions.map((minutes) => (
          <button
            key={minutes}
            onClick={() => handleExpirationChange(minutes)}
            className={`expiration-button ${expirationTime === minutes ? 'active' : ''}`}
          >
            {formatExpirationTime(minutes)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpirationSelector;