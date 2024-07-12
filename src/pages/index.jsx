// This is the main page of the Next.js application.
// It renders the FileUpload component and other UI elements for the file upload service.

import React from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DonationSection from '../components/DonationSection';
import UploadHistory from '../components/UploadHistory';

/**
 * The Home component is the main page of the Next.js application.
 * It renders the FileUpload component and other UI elements for the file upload service.
 */
export default function Home() {
  return (
    <div className="bg-app-background text-text-color min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FileUpload />
        <DonationSection />
        <UploadHistory />
      </main>
      <Footer />
    </div>
  );
}