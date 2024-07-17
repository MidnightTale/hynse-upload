// @perama: This file contains utility functions for formatting file sizes and upload speeds.

import config from '../../../config';

export const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond >= 1073741824) {
    return `${(bytesPerSecond / 1073741824).toFixed(2)} GB/s`;
  } else if (bytesPerSecond >= 1048576) {
    return `${(bytesPerSecond / 1048576).toFixed(2)} MB/s`;
  } else if (bytesPerSecond >= 1024) {
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  } else {
    return `${Math.round(bytesPerSecond)} B/s`;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return 'Empty file 👻';
  if (bytes === config.multer.limits.fileSize) return 'Perfection 👌';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};