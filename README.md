# Next.js

A modern Next.js 14 application built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Next.js 14** - Latest version with improved performance and features
- **React 18** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
 - **Real-time updates** using a lightweight Socket.IO dev server (see quickstart for starting it)

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn


## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
4. (Optional) Start the Socket.IO dev server for real-time updates:
  ```bash
  npm run socket
  # or
  yarn socket
  ```
Troubleshooting:
- If `npm run socket` exits with an error complaining about `socket.io`:
  ```bash
  npm install socket.io socket.io-client
  npm run socket
  ```
- If you get a port in use error (EADDRINUSE):
  - On Windows (PowerShell):
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 4030).OwningProcess
    ```
    Then stop the process or set `SOCKET_PORT` environment variable to a different port before running.
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
nextjs-js-tailwind/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 🧩 Page Editing

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:

  ```bash
  npm run build
  ```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments
 
- Powered by Next.js and React
- Styled with Tailwind CSS

 