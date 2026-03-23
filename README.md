# NexChat Premium Chat Application

A high-performance, real-time chat application inspired by Slack and WhatsApp, built with React, Tailwind CSS, and Firebase.

## Features

- **Real-time Messaging**: Instant updates via Firebase Firestore.
- **PWA Ready**: Installable on mobile and desktop for a native-like experience.
- **Responsive Design**: Uses Tailwind Container Queries for a flexible, adaptive UI.
- **Premium UI**: Glassmorphism, smooth animations, and a modern aesthetic.
- **CSS Cascade Layers**: Organized styling with prioritized layers.

## Setup Instructions

### 1. Firebase Configuration

You need to provide your own Firebase configuration to enable real-time messaging.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a Web App to your project.
4. Copy the `firebaseConfig` object.
5. Paste it into `src/lib/firebase.ts`.

### 2. Firestore Rules

Ensure your Firestore rules allow read/write access (for development):

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Only for development!
    }
  }
}
```

### 3. Running Locally

```bash
npm install
npm run dev
```

## Tech Stack

- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, Container Queries, Cascade Layers
- **UI Components**: shadcn/ui (Radix UI)
- **Real-time**: Firebase
- **PWA**: `vite-plugin-pwa`
- **Animations**: Framer Motion
