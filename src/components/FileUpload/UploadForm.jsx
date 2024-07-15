// @perama: This component provides the drag and drop interface for file uploads.
// It now features a glassy card-like design similar to history items.

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { logError } from '../clientLogUtil';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes'; // Import useTheme

const UploadForm = ({ isUploading, onDrop }) => {
  const { theme } = useTheme(); // Get the current theme
  const handleDrop = useCallback((acceptedFiles) => {
    try {
      onDrop(acceptedFiles);
    } catch (error) {
      logError('Error handling file drop', { error: error.message }, 500);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleDrop,
    disabled: isUploading,
    multiple: true
  });

  const animationVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <div className="mb-8 relative">
      <motion.div
        {...getRootProps({
          className: `p-8 rounded-lg backdrop-blur-md bg-opacity-80 transition-all duration-300 ease-in-out flex flex-col items-center justify-center h-64 text-center cursor-pointer
            ${isDragActive ? 'bg-history-item-hover-background' : 'bg-history-item-background'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-history-item-hover-background'}
            shadow-[0_0_0_1px_var(--history-item-border-color),0_2px_4px_rgba(0,0,0,0.1)]`,
        })}
        variants={animationVariants}
        animate={isDragActive && !isUploading ? 'hover' : 'idle'}
      >
        <div className="w-full h-full border-2 border-dashed border-dropzone-color rounded-lg p-4 flex flex-col items-center justify-center">
          <input {...getInputProps()} disabled={isUploading} />
          <FaCloudUploadAlt className={`text-6xl mb-4 text-dropzone-icon-color ${isDragActive && !isUploading ? 'animate-bounce' : ''}`} />
          <p className="text-lg mb-2 text-history-item-text">
            {isUploading
              ? 'Upload in progress...'
              : isDragActive
              ? 'Release to upload the files'
              : "Drag 'n' drop files here, or click to select files"}
          </p>
          <p className="text-sm text-dropzone-subtext-color">
            {isUploading ? 'Please wait' : 'Supported file types: Any'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadForm;