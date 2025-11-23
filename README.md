# Community Hall Booking App

A responsive web application for booking a community hall, built with **Next.js** and **MongoDB**.

## Features

- **Public Calendar**: View availability of the community hall.
- **Booking System**: Users can book available dates by providing their name and flat number.
- **Admin Dashboard**: 
  - Login (Password: `admin123`)
  - View all bookings.
  - Mark bookings as Paid/Unpaid.
  - Delete bookings.
  - Download booking reports as Excel.
- **Responsive Design**: Works on Desktop, Tablet, and Mobile.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Styling**: CSS Modules / Global CSS (Minimalist)
- **Libraries**: `react-calendar`, `date-fns`, `xlsx`, `mongoose`

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sig18aaokolkata-a11y/CommunityHallBooking.git
    cd CommunityHallBooking
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory and add your MongoDB URI:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the `MONGODB_URI` environment variable in the Vercel project settings.
4.  Deploy.
