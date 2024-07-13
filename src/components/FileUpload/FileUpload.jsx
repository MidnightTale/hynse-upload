// @perama: This is the main FileUpload component that orchestrates the file upload process.
// It combines the UploadForm, ExpirationSelector, and UploadHistory components.

import React from 'react';
import UploadForm from './UploadForm';
import ExpirationSelector from './ExpirationSelector';
import UploadHistory from '../UploadHistory';
import useFileUpload from './useFileUpload';
import { logError } from '../clientLogUtil';

const FileUpload = () => {
  const {
    isUploading,
    expirationTime,
    history,
    setExpirationTime,
    onDrop,
    setHistory
  } = useFileUpload();

  const handleExpirationChange = (newExpirationTime) => {
    try {
      setExpirationTime(newExpirationTime);
    } catch (error) {
      logError('Error setting expiration time', { error: error.message });
    }
  };

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