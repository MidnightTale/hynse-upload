import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Overview from './Overview';
import Settings from './Settings';
import TopLoadingBar from './TopLoadingBar';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    setProgress(30);
    setTimeout(() => setProgress(100), 1000);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-app-background">
      <TopLoadingBar progress={progress} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-history-item-text">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;