# Mobile React App

A modern React application built with Vite that works on both web and mobile platforms.

## Features

- ⚡ **Vite** - Fast build tool
- 📱 **React Native Web** - Write once, run on web and mobile
- 🔄 **PWA Support** - Installable as mobile app
- 📦 **Latest React** - Using React 18+
- 🎨 **Mobile-First Design** - Responsive and touch-friendly

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Mobile App Usage

### Install as PWA
1. Open the app in a mobile browser (Chrome/Safari)
2. Click "Add to Home Screen" or "Install"
3. The app will be installed like a native app

### React Native (Optional)
To build native iOS/Android apps, you can:
1. Use Expo: `npx create-expo-app`
2. Share components between web and native using React Native Web

## Project Structure

```
mobile-react-app/
├── src/
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Technologies

- React 18+
- Vite 7+
- React Native Web
- PWA (Progressive Web App)
