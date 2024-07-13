// @perama: This component renders a progress bar for file uploads.
// It uses React.memo for performance optimization and includes error handling.

import React from 'react';
import { logError } from './clientLogUtil';

/**
 * ProgressBar component to display upload progress.
 * @param {Object} props - The component props.
 * @param {number} props.progress - The upload progress percentage.
 * @param {string} props.uploadStatus - The upload status message.
 * @param {string} props.speed - The upload speed.
 * @returns {JSX.Element|null} The rendered component or null if completed.
 */
const ProgressBar = React.memo(({ progress, uploadStatus, speed }) => {
  try {
    // * Highlight: Check if the upload is completed
    const isCompleted = progress === 100;

    // * Highlight: Return null if the upload is completed to hide the progress bar
    if (isCompleted) {
      return null;
    }

    return (
      <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden">
        {/* * Highlight: Progress bar fill */}
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${Math.round(progress)}%` }}
        ></div>
        {/* * Highlight: Progress text overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
          {uploadStatus} - {speed}
        </div>
      </div>
    );
  } catch (error) {
    // ! Alert: Log error if rendering fails
    logError('Error rendering ProgressBar', { error: error.message });
    return null;
  }
}, (prevProps, nextProps) => {
  // * Highlight: Custom comparison function for React.memo
  return (
    Math.abs(prevProps.progress - nextProps.progress) < 1 &&
    prevProps.uploadStatus === nextProps.uploadStatus &&
    prevProps.speed === nextProps.speed
  );
});

// TODO: Add accessibility features such as aria-labels and role attributes
// TODO: Consider adding a color change feature for different progress stages

export default ProgressBar;