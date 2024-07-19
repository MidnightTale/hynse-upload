import axios from 'axios';
import { logInfo, logWarn, logError } from './clientLogUtil';

const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const initiateHandshake = async () => {
  try {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('sessionId', sessionId);
      logInfo('New Session ID generated and stored', { sessionIdLength: sessionId.length });
    } else {
      logInfo('Existing Session ID retrieved', { sessionIdLength: sessionId.length });
    }

    const response = await axios.post('/api/request-session-key', { sessionId });
    const { key, salt } = response.data;
    sessionStorage.setItem('sessionKey', key);
    sessionStorage.setItem('sessionSalt', salt);
    logInfo('Session key and salt received and stored', { keyLength: key.length, saltLength: salt.length });

    startHeartbeat();

    return { sessionId, sessionKey: key, sessionSalt: salt };
  } catch (error) {
    logError('Error during handshake', error);
    throw error;
  }
};

export const getSessionData = () => {
  return {
    sessionId: localStorage.getItem('sessionId'),
    sessionKey: sessionStorage.getItem('sessionKey'),
    sessionSalt: sessionStorage.getItem('sessionSalt'),
  };
};

export const startHeartbeat = () => {
  const heartbeatInterval = setInterval(async () => {
    try {
      const { sessionId, sessionKey, sessionSalt } = getSessionData();
      if (sessionId && sessionKey && sessionSalt) {
        const response = await axios.post('/api/heartbeat', { sessionId, sessionKey, sessionSalt });
        if (response.status === 200) {
          logInfo('Heartbeat sent successfully', { sessionId });
        } else {
          logWarn('Unexpected response from heartbeat', { status: response.status });
          clearInterval(heartbeatInterval);
        }
      } else {
        logWarn('No session data found for heartbeat');
        clearInterval(heartbeatInterval);
      }
    } catch (error) {
      logError('Error sending heartbeat', error);
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        logWarn('Invalid session or session not found. Stopping heartbeat.');
        clearInterval(heartbeatInterval);
      }
    }
  }, 1000 * 90); // Send heartbeat every 90 seconds

  return heartbeatInterval;
};