# 📅 Event Management Application

This is a full-stack Event Management application built on the **MERN stack** (MongoDB, Express, React, Node.js). It is designed to manage event scheduling across multiple user profiles, with a critical focus on **time zone standardization** and efficient, immediate state updates.

## ✨ Features

The application provides robust tools for multi-profile scheduling and management:

* **Multi-Profile Event Filtering:** The event list is dynamically filtered to show only events relevant to the currently selected user profile.
* **Time Zone Conversion:** Events are stored universally on the backend. The frontend provides a **"View in Timezone"** selector for real-time conversion and display of event times.
* **Past Date Validation:** Implemented client-side validation using the **native HTML `min` attribute** on date inputs to strictly block users from selecting or scheduling events in the past.
* **Immediate UI Updates:** Events are rendered instantly upon creation without requiring a page refresh, achieved through optimized Redux state updates.

---

## 💻 Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** | Component-based UI rendering. |
| **State Management** | **Redux Toolkit (RTK)** | Predictable state management using `createSlice` and `createAsyncThunk`. |
| **Styling** | **CSS** | Custom user interface design. |
| **Backend** | **Node.js & Express** | RESTful API creation and server logic. |
| **Database** | **MongoDB & Mongoose** | Flexible, document-based database for storing profiles and events. |

---

## ⚙️ Installation and Setup (Local Development)

Follow these steps to get the Event Scheduler running locally.

### 1. Prerequisites

You must have the following installed on your system:

* Node.js (LTS version)
* npm or yarn
* MongoDB running locally or a MongoDB Atlas connection string.

### 2. Backend Setup

1.  Navigate to your project's backend directory (e.g., `server/` or `backend/`).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a file named **`.env`** in the backend root and add your configuration:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/eventdb # OR your MongoDB Atlas URI
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The API should start running on `http://localhost:5000`.

### 3. Frontend Setup

1.  Navigate to your project's frontend directory (e.g., `client/` or `.` if mono-repo).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a file named **`.env`** in the frontend root and set the API URL:
    ```
    # If running backend locally:
    REACT_APP_API_URL=http://localhost:5000/api
    ```
4.  Start the React development server:
    ```bash
    npm start
    ```
    The application will open in your browser, typically at `http://localhost:3000`.

---

## 🚀 Deployment Guide (MERN Stack)

This project requires deploying the backend API and the frontend application separately.

### 1. Backend Deployment (API & Database)

1.  **Database:** Migrate your MongoDB to a cloud service like **MongoDB Atlas**. Obtain the production connection URI.
2.  **Code Preparation:** Ensure your Express server uses the production port (`process.env.PORT`) and has configured **CORS** to allow requests from your frontend's final domain (e.g., `https://yourapp.netlify.app`).
3.  **Hosting:** Deploy your Node.js backend to a cloud service like **Render** or **Heroku**.
4.  **Configuration:** Set the MongoDB Atlas connection URI and any other secrets as **Environment Variables** in your hosting service. This will provide your production API URL (e.g., `https://yourapp-api.onrender.com`).

### 2. Frontend Deployment (React)

1.  **Update API URL:** In your React frontend's `.env` file, change `REACT_APP_API_URL` to point to your new production backend URL.
2.  **Hosting:** Deploy your React application to a static hosting service like **Netlify** or **Vercel**.
3.  **Build Settings:** Configure the build command (`npm run build`) and the publish directory (`build`).

---

*Developed by [Mannam Raveendra Babu]*