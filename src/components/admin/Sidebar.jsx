import React from 'react';
import { useRouter } from 'next/router';
import { FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  return (
    <div className="w-64 h-screen bg-history-item-background backdrop-blur-md border-r border-history-item-border p-6">
      <h2 className="text-2xl font-bold mb-6 text-history-item-text">Admin Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center w-full p-2 rounded hover:bg-history-item-hover-background text-history-item-text transition-colors duration-200 ${activeTab === 'overview' ? 'bg-history-item-hover-background' : ''}`}
            >
              <FaHome className="mr-3" /> Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-2 rounded hover:bg-history-item-hover-background text-history-item-text transition-colors duration-200 ${activeTab === 'settings' ? 'bg-history-item-hover-background' : ''}`}
            >
              <FaCog className="mr-3" /> Settings
            </button>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center p-2 rounded hover:bg-history-item-hover-background text-history-item-text transition-colors duration-200 mt-auto"
      >
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;