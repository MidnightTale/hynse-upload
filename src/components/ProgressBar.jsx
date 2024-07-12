// This component renders a progress bar for file uploads.

import React from 'react';

/**
 * ProgressBar component to display upload progress.
 * @param {Object} props - The component props.
 * @param {number} props.progress - The upload progress percentage.
 * @param {string} props.uploadStatus - The upload status message.
 * @param {string} props.speed - The upload speed.
 * @returns {JSX.Element} The rendered component.
 */
const ProgressBar = React.memo(({ progress, uploadStatus, speed }) => {
  const isCompleted = progress === 100;

  if (isCompleted) {
    return null;
  }

  return (
    <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
        style={{ width: `${Math.round(progress)}%` }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        {uploadStatus} - {speed}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    Math.abs(prevProps.progress - nextProps.progress) < 1 &&
    prevProps.uploadStatus === nextProps.uploadStatus &&
    prevProps.speed === nextProps.speed
  );
});

export default ProgressBar;