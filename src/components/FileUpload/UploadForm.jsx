// @perama: This component provides the drag and drop interface for file uploads.
// It uses react-dropzone for handling file drops and integrates with the parent component's upload logic.

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { logError } from '../clientLogUtil';

/**
 * UploadForm component for handling file uploads via drag and drop or click.
 * @param {Object} props - The component props
 * @param {boolean} props.isUploading - Indicates if a file is currently being uploaded
 * @param {Function} props.onDrop - Callback function to handle dropped files
 * 
 * ! This component doesn't handle file type or size restrictions directly.
 * TODO: Implement client-side file type and size validation before calling onDrop.
 * * The component uses react-dropzone to handle file drops and selection.
 */
const UploadForm = ({ isUploading, onDrop }) => {
  /**
   * Handles the file drop event
   * @param {File[]} acceptedFiles - Array of accepted files from the drop event
   */
  const handleDrop = (acceptedFiles) => {
    try {
      onDrop(acceptedFiles);
    } catch (error) {
      // ! Alert: Error handling for file drop failures
      logError('Error handling file drop', { error: error.message }, 500);
    }
  };

  // * Highlight: useDropzone hook configuration
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