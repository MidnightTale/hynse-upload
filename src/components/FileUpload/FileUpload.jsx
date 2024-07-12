// @perama: This is the main FileUpload component that orchestrates the file upload process.
// It combines the UploadForm, ExpirationSelector, and UploadHistory components.

import React from 'react';
import UploadForm from './UploadForm';
import ExpirationSelector from './ExpirationSelector';
import UploadHistory from '../UploadHistory';
import useFileUpload from './useFileUpload';

const FileUpload = () => {
  const {
    uploadStatus,
    isUploading,
    expirationTime,
    history,
    setExpirationTime,
    onDrop,
    setHistory
  } = useFileUpload();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <UploadForm isUploading={isUploading} onDrop={onDrop} />
      <ExpirationSelector 
        expirationTime={expirationTime} 
        setExpirationTime={setExpirationTime} 
      />
      <p className="mt-4 text-center">{uploadStatus}</p>
      <UploadHistory history={history} updateHistory={setHistory} />
    </div>
  );
};

export default FileUpload;