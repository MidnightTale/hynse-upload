// This is the main page of the Next.js application.
// It renders the FileUpload component for users to upload files.

import FileUpload from '../components/FileUpload';

/**
 * The Home component is the main page of the Next.js application.
 * It renders the FileUpload component, which provides a file upload interface for users.
 */
export default function Home() {
  return (
    <div>
      <h1>File Upload Service</h1>
      <FileUpload />
    </div>
  );
}