import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaCheck, FaTimes, FaLock, FaBackspace } from 'react-icons/fa';
import appConfig from '../../../config';

const Settings = () => {
  const [appConfig, setAppConfig] = useState(null);
  const [pin, setPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const config = response.data;
      if (!config.multer.selectedForbiddenExtensions) {
        config.multer.selectedForbiddenExtensions = [];
      }
      setAppConfig(config);
    } catch (error) {
      toast.error('Failed to fetch configuration');
    }
  };

  const verifyPin = () => {
    if (pin === '1234') {
      setIsPinVerified(true);
    } else {
      toast.error('Incorrect PIN');
      setPin('');
    }
  };

  const handlePinInput = (value) => {
    if (pin.length < 4) {
      setPin(prevPin => prevPin + value);
    }
  };

  const handleBackspace = () => {
    setPin(prevPin => prevPin.slice(0, -1));
  };

  const handleChange = (section, key, value) => {
    setAppConfig(prevConfig => ({
      ...prevConfig,
      [section]: {
        ...prevConfig[section],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/admin/config', appConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update configuration');
    }
  };

  if (!appConfig) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {!isPinVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-history-item-background p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-history-item-text text-center">Enter PIN</h2>
            <div className="mb-4 text-center">
              <input
                type="password"
                value={pin}
                readOnly
                className="w-full p-2 text-2xl text-center rounded bg-input-background text-input-text border border-history-item-border"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="p-4 text-2xl rounded bg-primary-color text-white hover:bg-opacity-90 transition-colors duration-200"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="p-4 text-2xl rounded bg-primary-color text-white hover:bg-opacity-90 transition-colors duration-200"
              >
                <FaBackspace />
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="p-4 text-2xl rounded bg-primary-color text-white hover:bg-opacity-90 transition-colors duration-200"
              >
                0
              </button>
              <button
                onClick={verifyPin}
                className="p-4 text-2xl rounded bg-green-500 text-white hover:bg-opacity-90 transition-colors duration-200"
              >
                <FaCheck />
              </button>
            </div>
          </div>
        </div>
      )}
      {isPinVerified && (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-4 text-history-item-text">Admin Settings</h2>

          {/* Redis Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Redis Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Host</label>
                <input
                  type="text"
                  value={appConfig.redis.host}
                  onChange={(e) => handleChange('redis', 'host', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Port</label>
                <input
                  type="number"
                  value={appConfig.redis.port}
                  onChange={(e) => handleChange('redis', 'port', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
            </div>
          </div>

          {/* Multer Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Multer Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Limits</label>
                <input
                  type="text"
                  value={appConfig.multer.limits.fileSize}
                  onChange={(e) => handleChange('multer', 'limits', { ...appConfig.multer.limits, fileSize: e.target.value })}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Forbidden Extensions</label>
                <div className="flex flex-col">
                  {appConfig.multer.forbiddenExtensions.map((ext) => (
                    <label key={ext} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={appConfig.multer.selectedForbiddenExtensions.includes(ext)}
                        onChange={(e) => {
                          const newExtensions = e.target.checked
                            ? [...appConfig.multer.selectedForbiddenExtensions, ext]
                            : appConfig.multer.selectedForbiddenExtensions.filter(item => item !== ext);
                          handleChange('multer', 'selectedForbiddenExtensions', newExtensions);
                        }}
                        className="mr-2"
                      />
                      {ext}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Upload Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">URL</label>
                <input
                  type="text"
                  value={appConfig.upload.url}
                  onChange={(e) => handleChange('upload', 'url', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Default Expiration Time</label>
                <input
                  type="number"
                  value={appConfig.upload.defaultExpirationTime}
                  onChange={(e) => handleChange('upload', 'defaultExpirationTime', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
            </div>
          </div>

          {/* Rate Limit Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Rate Limit Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Window (ms)</label>
                <input
                  type="number"
                  value={appConfig.rateLimit.windowMs}
                  onChange={(e) => handleChange('rateLimit', 'windowMs', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Max Requests</label>
                <input
                  type="number"
                  value={appConfig.rateLimit.max}
                  onChange={(e) => handleChange('rateLimit', 'max', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
            </div>
          </div>

          {/* Log Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Log Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Log Level</label>
                <input
                  type="text"
                  value={appConfig.log.level}
                  onChange={(e) => handleChange('log', 'level', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-history-item-text mb-1">Log Uploads</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={appConfig.log.logUploads}
                    onChange={(e) => handleChange('log', 'logUploads', e.target.checked)}
                    className="mr-2"
                  />
                  {appConfig.log.logUploads ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                </div>
              </div>
            </div>
          </div>

          {/* Secret Key Configuration */}
          <div className="bg-history-item-background p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-history-item-text">Secret Key Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-history-item-text mb-1">Secret Key</label>
                <input
                  type="text"
                  value={appConfig.secretKey}
                  onChange={(e) => handleChange('secretKey', 'value', e.target.value)}
                  className="w-full p-2 rounded bg-[var(--app-background)] text-input-text border border-history-item-border"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="flex items-center justify-center w-full p-2 rounded bg-primary-color text-white hover:bg-opacity-90 transition-colors duration-200">
            <FaSave className="mr-2" /> Save Configuration
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;