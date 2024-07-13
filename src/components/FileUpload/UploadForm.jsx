// @perama: This component provides the drag and drop interface for file uploads.

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { logError } from '../clientLogUtil';

const UploadForm = ({ isUploading, onDrop }) => {
  const handleDrop = (acceptedFiles) => {
    try {
      onDrop(acceptedFiles);
    } catch (error) {
      logError('Error handling file drop', { error: error.message }, 500);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div
      {...getRootProps({
        className: "border-2 border-dashed border-dropzone-color p-8 rounded-lg bg-dropzone-background cursor-pointer hover:bg-dropzone-hover-background transition-colors duration-300 ease-in-out flex items-center justify-center h-48 text-center",
      })}
      style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
    >
      <input {...getInputProps()} disabled={isUploading} />
      <p className="text-lg">Drag 'n' drop a file here, or click to select a file</p>
    </div>
  );
};

export default UploadForm;