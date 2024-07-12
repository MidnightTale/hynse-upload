# StellarFileServer

StellarFileServer is a robust and efficient file upload server built using Next.js. It allows users to upload files, which are then stored temporarily on the server. The project includes features for managing these files, such as listing, sorting, and downloading them.

## Features

- File upload with drag-and-drop functionality
- Temporary file storage using Redis
- Asynchronous file handling for improved performance
- Multithreading for server-side file processing
- Command-line interface for administrative tasks
- Proper error handling for failed uploads and other errors
- Rate limiting to prevent abuse
- Logging system with different log levels

## Technologies Used

- Next.js
- Redis
- Multer for file uploads
- React-dropzone for the frontend upload interface
- Worker threads for multithreading
- Tailwind CSS for styling

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/StellarFileServer.git
   ```

2. Install dependencies:
   ```
   bun i
   ```

3. Set up Redis:
   Ensure you have Redis installed and running on your system.

4. Configure the application:
   Edit the `config.js` file to set your desired configuration options.

5. Run the development server:
   ```
   bun --bun run dev
   ```

6. Open [http://localhost:3022](http://localhost:3022) in your browser to see the application.

## API Routes

- `POST /api/upload/requestUpload`: Upload files
- `GET /api/download/[id]`: Download a file by its ID

## CLI Commands

- `node cli.js [command]`: Run administrative commands
