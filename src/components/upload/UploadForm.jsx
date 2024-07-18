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
import TermsOfService from '../common/TermsOfService';

const forbiddenExtensions = config.multer.forbiddenExtensions;
const forbiddenPrefixes = config.multer.forbiddenPrefixes;

const TOS_LAST_UPDATED = "2024-07-18"; // Replace with the actual last update date

const UploadForm = ({ isUploading, onDrop }) => {
  const [isTOSOpen, setIsTOSOpen] = useState(false);
  const [hasTOSAccepted, setHasTOSAccepted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const tosAccepted = localStorage.getItem('tosAccepted') === 'true';
    setHasTOSAccepted(tosAccepted);
  }, []);

  const handleTOSAccept = useCallback(() => {
    setHasTOSAccepted(true);
    localStorage.setItem('tosAccepted', 'true');
    setIsTOSOpen(false);
  }, []);

  const onDropHandler = useCallback((acceptedFiles) => {
    if (!hasTOSAccepted) {
      setIsTOSOpen(true);
      return;
    }

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
  }, [onDrop, hasTOSAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: onDropHandler,
    disabled: isUploading || !hasTOSAccepted,
    multiple: true,
    noClick: !hasTOSAccepted
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
              : !hasTOSAccepted
              ? 'Please accept the Terms of Service to upload'
              : isDragActive
              ? 'Release to upload the files'
              : "Drag 'n' drop files here, or click to select files"}
          </p>
          <p className="text-sm text-dropzone-subtext-color">
            {!hasTOSAccepted && (
              <button
                onClick={() => setIsTOSOpen(true)}
                className="text-primary-color hover:underline focus:outline-none"
              >
                View Terms of Service
              </button>
            )}
          </p>
        </div>
      </motion.div>
      <TermsOfService 
        isOpen={isTOSOpen} 
        onClose={() => setIsTOSOpen(false)} 
        onAccept={handleTOSAccept} 
        lastUpdated={TOS_LAST_UPDATED}
      />
    </div>
  );
};

export default UploadForm;