import axios from 'axios';
import { logInfo, logError } from './clientLogUtil';

const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const initiateHandshake = async () => {
  try {
    const sessionId = generateSessionId();
    sessionStorage.setItem('sessionId', sessionId);
    logInfo('Session ID generated', { sessionIdLength: sessionId.length });

    const response = await axios.post('/api/request-session-key', { sessionId });
    const { key, salt } = response.data;
    sessionStorage.setItem('sessionKey', key);
    sessionStorage.setItem('sessionSalt', salt);
    logInfo('Session key and salt received and stored');
    return { sessionId, sessionKey: key, sessionSalt: salt };
  } catch (error) {
    logError('Error during handshake', error);
    throw error;
  }
};

export const getSessionData = () => {
  return {
    sessionId: sessionStorage.getItem('sessionId'),
    sessionKey: sessionStorage.getItem('sessionKey'),
    sessionSalt: sessionStorage.getItem('sessionSalt'),
  };
};