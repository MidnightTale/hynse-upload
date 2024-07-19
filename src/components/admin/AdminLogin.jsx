import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app-background">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-history-item-background backdrop-blur-md border border-history-item-border">
        <h2 className="text-2xl mb-6 text-history-item-text text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-history-item-text mb-2" htmlFor="username">
              <FaUser className="inline-block mr-2" /> Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-input-background text-input-text border border-history-item-border"
            />
          </div>
          <div className="mb-6">
            <label className="block text-history-item-text mb-2" htmlFor="password">
              <FaLock className="inline-block mr-2" /> Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-input-background text-input-text border border-history-item-border"
            />
          </div>
          <button type="submit" className="w-full p-2 rounded bg-primary-color text-white hover:bg-opacity-90 transition-colors duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;