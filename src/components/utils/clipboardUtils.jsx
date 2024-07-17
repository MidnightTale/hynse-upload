import { toast } from 'react-toastify';
import { logInfo, logError } from './clientLogUtil';

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Download link copied to clipboard!');
    logInfo('Download link copied to clipboard', { text });
  } catch (error) {
    toast.error('Failed to copy download link to clipboard');
    logError('Error copying to clipboard', { error: error.message });
  }
};