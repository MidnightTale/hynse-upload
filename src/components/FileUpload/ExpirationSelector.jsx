// @perama: This component allows users to select the expiration time for uploaded files.

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
    <div className="mt-4">
      <label htmlFor="expiration" className="block mb-2">Select expiration time:</label>
      <div className="flex space-x-2 flex-wrap">
        {config.upload.expirationOptions.map((minutes) => (
          <button
            key={minutes}
            onClick={() => handleExpirationChange(minutes)}
            className={`px-4 py-2 rounded mb-2 ${
              expirationTime === minutes
                ? 'bg-active-button text-button-text'
                : 'bg-button-background text-button-text hover:bg-button-hover'
            }`}
          >
            {formatExpirationTime(minutes)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpirationSelector;