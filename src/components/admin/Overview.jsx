import React from 'react';
import { FaFileUpload, FaUsers, FaServer } from 'react-icons/fa';

const OverviewCard = ({ icon: Icon, title, value }) => (
  <div className="bg-history-item-background p-6 rounded-lg shadow-md border border-history-item-border backdrop-blur-md">
    <div className="flex items-center mb-4">
      <Icon className="text-3xl mr-4 text-primary-color" />
      <h3 className="text-lg font-semibold text-history-item-text">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-history-item-text">{value}</p>
  </div>
);

const Overview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <OverviewCard icon={FaFileUpload} title="Total Uploads" value="1,234" />
      <OverviewCard icon={FaUsers} title="Active Users" value="567" />
      <OverviewCard icon={FaServer} title="Server Status" value="Online" />
    </div>
  );
};

export default Overview;