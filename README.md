# 🚀 StellarFileServer

StellarFileServer is a robust and efficient file upload server built with Next.js and Bun. It offers a seamless file sharing experience with temporary storage and easy management.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)

> [!NOTE]
> StellarFileServer is designed for temporary file storage. Files are automatically deleted after a set period.

## ✨ Features

- 📁 Drag-and-drop file uploads
- ⏳ Temporary file storage with Redis
- 🚀 Asynchronous file handling
- 🧵 Multithreaded server-side processing
- 🛡️ Rate limiting to prevent abuse
- 📊 Comprehensive logging system


## 🚀 Getting Started

> [!IMPORTANT]
> Ensure you have Redis installed and running on your system before starting the application.

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/StellarFileServer.git
cd StellarFileServer
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up Redis**
   Ensure Redis is installed and running on your system.

4. **Configure the application**
   Edit `config.js` to set your desired options.

5. **Open the application**
   Visit [http://localhost:3022](http://localhost:3022) in your browser.

> [!CAUTION]
> Be careful when modifying the `config.js` file. Incorrect settings may cause the application to malfunction.

## 🔗 API Routes


### Custom Server Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload` | Upload files |
| GET | `/d/:fileId` | Download a file by ID |

> [!NOTE]
> The custom server routes are handled directly by Express, bypassing Next.js routing.
## 💻 CLI Commands

Run administrative commands using:
```bash
node cli.js [command]
```

> [!WARNING]
> Some CLI commands may permanently delete files or clear data. Use with caution.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.