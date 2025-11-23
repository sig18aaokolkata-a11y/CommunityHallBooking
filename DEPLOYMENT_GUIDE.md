# Deployment Guide

Follow these steps to configure and deploy your Community Hall Booking application.

## 1. Configure Firebase (Required)
The application needs a backend for the database. We use Firebase (Free Tier).

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and give it a name (e.g., `community-hall-booking`).
3.  Disable Google Analytics (for simplicity) and create the project.
4.  Once created, click the **Web icon (`</>`)** to add an app.
    *   Register the app (e.g., `CommunityHallWeb`).
    *   **Copy the `firebaseConfig` object** (the keys inside `const firebaseConfig = { ... }`).
5.  **Enable Firestore Database**:
    *   Go to **Build** > **Firestore Database** in the left sidebar.
    *   Click **Create Database**.
    *   Choose a location (e.g., `nam5` or closest to you).
    *   **Security Rules**: Start in **Test Mode** (allows read/write for 30 days) OR use these basic rules:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true;
            }
          }
        }
        ```
        *(Note: For a real production app, you would restrict these rules further).*

## 2. Update Local Configuration
1.  Open the file `src/firebase-config.js` in your project.
2.  Replace the placeholder values with the real keys you copied from Firebase.

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 3. Deploy to GitHub
Now that the config is set, push your code to GitHub. This will trigger the automated deployment.

1.  Open your terminal in the project folder.
2.  Commit your configuration changes:
    ```bash
    git add src/firebase-config.js
    git commit -m "Configure Firebase keys"
    ```
3.  Push to GitHub:
    ```bash
    git push origin main
    ```

## 4. Access Your App
1.  Go to your GitHub repository page.
2.  Click on the **Actions** tab. You should see a workflow running (e.g., "Deploy to GitHub Pages").
3.  Wait for it to turn green (Success).
4.  Go to **Settings** > **Pages** (in the left sidebar).
5.  You will see your live URL (e.g., `https://sig18aaokolkata-a11y.github.io/CommunityHallBooking/`).
6.  Click the link to view your deployed app!
