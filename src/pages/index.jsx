// @perama: This is the main page of the Next.js application.
// It renders the FileUpload component and other UI elements for the file upload service.

import React from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DonationSection from '../components/DonationSection';
import UploadHistory from '../components/UploadHistory';
import CustomToast from '../components/CustomToast';

/**
 * The Home component is the main page of the Next.js application.
 * It renders the FileUpload component and other UI elements for the file upload service.
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home() {
  return (
    <div className="bg-app-background text-text-color min-h-screen">
      {/* * Highlight: CustomToast component for displaying notifications */}
      <CustomToast />

      {/* * Highlight: Header component for the top of the page */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* * Highlight: FileUpload component for handling file uploads */}
        <FileUpload />

        {/* * Highlight: DonationSection component for supporting server costs */}
        <DonationSection />

        {/* * Highlight: UploadHistory component for displaying past uploads */}
        <UploadHistory />
      </main>

      {/* * Highlight: Footer component for the bottom of the page */}
      <Footer />
    </div>
  );
}

// ! Alert: Ensure all imported components are properly implemented and styled
// TODO: Implement error boundary for better error handling
// TODO: Consider adding a loading state while components are being loaded
// @param CustomToast: Component for displaying toast notifications
// @param Header: Component for the page header
// @param FileUpload: Component for handling file uploads
// @param DonationSection: Component for displaying donation information
// @param UploadHistory: Component for showing upload history
// @param Footer: Component for the page footer