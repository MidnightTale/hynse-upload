// @perama: This file contains utility functions for formatting file sizes and upload speeds.
// These functions are used throughout the application to provide human-readable representations
// of file sizes and transfer speeds.
// 
// @integration: This file integrates with the Better Comments VSCode extension for improved readability.
// * Highlights are used for important implementation details.
// ! Alerts are used for potential issues or edge cases.
// TODO: comments indicate future improvements or considerations.
// @ param comments describe function parameters.

import config from '../../../config';

/**
 * Formats the given bytes per second into a human-readable speed string.
 * @param bytesPerSecond - The speed in bytes per second to format.
 * @returns A formatted string representing the speed (e.g., "10.5 MB/s").
 */
export const formatSpeed = (bytesPerSecond) => {
  // * This function uses a cascading if-else structure to determine the appropriate unit.
  // * The thresholds are based on powers of 1024 (2^10) for binary prefixes.
  if (bytesPerSecond >= 1073741824) {
    return `${(bytesPerSecond / 1073741824).toFixed(2)} GB/s`;
  } else if (bytesPerSecond >= 1048576) {
    return `${(bytesPerSecond / 1048576).toFixed(2)} MB/s`;
  } else if (bytesPerSecond >= 1024) {
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  } else {
    return `${Math.round(bytesPerSecond)} B/s`;
  }
  // TODO: Consider adding support for TB/s for extremely high speeds in future updates.
  // ! Alert: This function doesn't handle negative values, which should never occur in normal usage.
};

/**
 * Formats the given number of bytes into a human-readable file size string.
 * @param bytes - The number of bytes to format.
 * @returns A formatted string representing the file size (e.g., "10.5 MB").
 */
export const formatFileSize = (bytes) => {
  // ! Alert: Special cases for empty files and files at the maximum allowed size.
  if (bytes === 0) return 'Empty file 👻';
  if (bytes === config.multer.limits.fileSize) return 'Perfection 👌';

  // * This function uses logarithmic math to determine the appropriate unit.
  // * It supports up to terabytes (TB) for very large files.
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  
  // TODO: Consider adding support for larger units (PB, EB) if needed in the future.
  // ! Alert: This function assumes positive values. Negative bytes should never occur.
};