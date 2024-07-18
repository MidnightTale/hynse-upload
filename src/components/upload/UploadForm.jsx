// @perama: This component provides the drag and drop interface for file uploads.
// It now features a glassy card-like design similar to history items.

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { logError } from '../utils/clientLogUtil';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes'; // Import useTheme
import config from '../../../config';
import { toast } from 'react-toastify';
import path from 'path';

const forbiddenExtensions = config.multer.forbiddenExtensions;
const forbiddenPrefixes = config.multer.forbiddenPrefixes;

const UploadForm = ({ isUploading, onDrop }) => {
  const { theme } = useTheme(); // Get the current theme
  const onDropHandler = useCallback((acceptedFiles) => {
    const invalidFiles = acceptedFiles.filter(file => {
      const ext = path.extname(file.name).toLowerCase();
      return forbiddenExtensions.includes(ext) || 
             forbiddenPrefixes.some(prefix => ext.startsWith(prefix));
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files are not allowed: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: onDropHandler,
    disabled: isUploading,
    multiple: true
  });

  const animationVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative">
      <motion.div
        {...getRootProps({
          className: `dropzone-self backdrop-blur-md bg-opacity-80 transition-all duration-300 ease-in-out flex flex-col items-center justify-center h-64 text-center cursor-pointer
            ${isDragActive ? 'bg-history-item-hover-background' : 'bg-history-item-background'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-history-item-hover-background'}`,
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
            {isUploading ? 'Please wait' : 'By uploading, you accept our Terms of Service'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadForm;