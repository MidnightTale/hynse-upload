// @perama: This is the main FileUpload component that orchestrates the file upload process.
// It combines the UploadForm, ExpirationSelector, and UploadHistory components.
// * This component is responsible for managing the overall state of the file upload process.

import React from 'react';
import UploadForm from './UploadForm';
import ExpirationSelector from './ExpirationSelector';
import UploadHistory from '../UploadHistory';
import useFileUpload from './useFileUpload';
import { logError } from '../clientLogUtil';

/**
 * FileUpload component
 * @returns {JSX.Element} The rendered FileUpload component
 * 
 * ! This component doesn't handle file size limits directly. Ensure server-side validation is in place.
 * TODO: Implement client-side file size validation before upload
 * * The component uses a custom hook (useFileUpload) to manage its state and logic
 */
const FileUpload = () => {
  // @param isUploading: boolean - Indicates whether a file is currently being uploaded
  // @param expirationTime: number - The selected expiration time for the uploaded file
  // @param history: Array - The upload history of files
  // @param setExpirationTime: function - Function to update the expiration time
  // @param onDrop: function - Function to handle file drop events
  // @param setHistory: function - Function to update the upload history
  const {
    isUploading,
    expirationTime,
    history,
    setExpirationTime,
    onDrop,
    setHistory
  } = useFileUpload();

  /**
   * Handle changes in the expiration time
   * @param {number} newExpirationTime - The new expiration time selected by the user
   * 
   * ! Ensure that the newExpirationTime is within acceptable limits
   */
  const handleExpirationChange = (newExpirationTime) => {
    try {
      setExpirationTime(newExpirationTime);
    } catch (error) {
      logError('Error setting expiration time', { error: error.message });
    }
  };

  /**
   * Handle updates to the upload history
   * @param {Array} newHistory - The updated upload history
   * 
   * TODO: Implement pagination for large history lists
   */
  const handleHistoryUpdate = (newHistory) => {
    try {
      setHistory(newHistory);
    } catch (error) {
      logError('Error updating history', { error: error.message });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <UploadForm isUploading={isUploading} onDrop={onDrop} />
      <ExpirationSelector 
        expirationTime={expirationTime} 
        setExpirationTime={handleExpirationChange} 
      />
      <UploadHistory history={history} updateHistory={handleHistoryUpdate} />
    </div>
  );
};

export default FileUpload;