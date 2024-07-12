```# File Upload with Next.js

This project demonstrates how to implement file upload functionality in a Next.js application with a focus on performance. The uploaded files are temporarily stored on the server using multithreading and asynchronous processing.

## Important Considerations

- Ensure file uploads are handled asynchronously using the provided form.
- Store uploaded files temporarily on the server.
- Utilize multithreading for server-side file handling to enhance performance.
- Use Redis for caching and managing temporary file storage.
- Implement proper error handling to manage failed uploads.
- Ensure the server has sufficient storage capacity for temporary files.
- Validate file types and sizes before processing uploads.
- Consider that code should not be spaghetti; it should be organized.
- Consider that the project should be modular and easy to configure from a config file.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/midnighttale/hynse-upload.git
   ```
2. Navigate to the project directory:
   ```bash
   cd hynse-upload
   ```

### Running the Development Server

To start the development server, run the following command:
   ```bash
   bun --bun run dev
   # or
   bun run dev
   ```