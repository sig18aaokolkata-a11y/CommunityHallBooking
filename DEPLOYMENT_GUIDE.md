# Deployment Guide

This application is built with **Next.js** and uses **MongoDB Atlas**. Because it requires a server-side backend for database connections, it cannot be hosted on static hosting services like GitHub Pages.

We recommend deploying to **Vercel**, the creators of Next.js, for the best experience.

## Prerequisites

1.  A [GitHub account](https://github.com/).
2.  A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub).
3.  Your MongoDB Connection String (URI).

## Steps to Deploy

### 1. Push to GitHub
Ensure your latest code is pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import into Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`CommunityHallBooking`).
4.  Click **Import**.

### 3. Configure Environment Variables
1.  In the "Configure Project" screen, look for the **Environment Variables** section.
2.  Add a new variable:
    *   **Key**: `MONGODB_URI`
    *   **Value**: `mongodb+srv://sig18aaokolkata_db_user:BosePukur%40Kolkata42@clustersignature18.8rzht2d.mongodb.net/community_hall_booking?appName=ClusterSignature18`
3.  Click **Add**.

### 4. Deploy
1.  Click **Deploy**.
2.  Vercel will build your application. This usually takes about a minute.
3.  Once complete, you will see a "Congratulations!" screen with a screenshot of your app.
4.  Click the screenshot or "Visit" button to see your live application.

## Updating Your App
Whenever you push changes to the `main` branch on GitHub, Vercel will automatically rebuild and redeploy your application with the new changes.
