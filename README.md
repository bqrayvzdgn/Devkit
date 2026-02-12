# DevKit

All-in-one developer tools desktop application built with Tauri, React, and TypeScript.

## Features

- 📝 **JSON/YAML Formatter** - Format, minify, validate, and convert between JSON and YAML
- 🔐 **Base64/URL Encoder** - Encode and decode Base64 and URL-safe Base64
- #️⃣ **Hash Generator** - Generate MD5, SHA-1, SHA-256, and SHA-512 hashes
- 🆔 **UUID Generator** - Generate UUIDs (v4 and v5)
- 🕐 **Timestamp Converter** - Convert between Unix timestamps, ISO 8601, and human-readable formats
- 🔑 **JWT Debugger** - Decode and inspect JWT tokens
- 📁 **File Operations** - Upload and download files
- ⌨️ **Keyboard Shortcuts** - Fast workflows with keyboard shortcuts
- 🌙 **Dark Mode** - Light and dark themes

## Installation

Download the latest release from the releases page:
- **Windows MSI Installer**: `devkit_0.1.0_x64_en-US.msi`
- **Windows NSIS Installer**: `devkit_0.1.0_x64-setup.exe`
- **Portable Executable**: `devkit.exe`

## Development

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- Tauri CLI

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Technologies

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Desktop Framework**: Tauri v2
- **Build Tool**: Vite
- **Routing**: React Router v7

## Author

Created by **bqrayvzdgn**

## License

MIT
