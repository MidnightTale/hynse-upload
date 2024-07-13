// @perama: This component allows users to select the expiration time for uploaded files.
// It integrates with the Better Comments VSCode extension for improved readability.

import React from 'react';
import config from '../../../config';
import { logError } from '../clientLogUtil';

/**
 * ExpirationSelector component
 * @param {Object} props - Component props
 * @param {number} props.expirationTime - The currently selected expiration time in minutes
 * @param {function} props.setExpirationTime - Function to update the expiration time
 * @returns {JSX.Element} Rendered ExpirationSelector component
 */
const ExpirationSelector = ({ expirationTime, setExpirationTime }) => {
  /**
   * Handles changes in the expiration time selection
   * @param {number} minutes - The selected expiration time in minutes
   */
  const handleExpirationChange = (minutes) => {
    try {
      setExpirationTime(minutes);
    } catch (error) {
      // ! Alert: Error handling for setting expiration time
      logError('Error setting expiration time', { error: error.message }, 500);
    }
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
            {/* * Highlight: Dynamic text generation for expiration options */}
            {minutes === 30 ? '30 minutes' :
             minutes === 60 ? '1 hour' : 
             minutes === 180 ? '3 hours' : 
             minutes === 720 ? '12 hours' : 
             minutes === 1440 ? '1 day' : '3 days'}
          </button>
        ))}
      </div>
    </div>
  );
};

// TODO: Implement custom expiration time input for more granular control
// TODO: Add confirmation dialog for short expiration times (e.g., less than 1 hour)

export default ExpirationSelector;