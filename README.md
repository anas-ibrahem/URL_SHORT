# URL Shortener with Authentication and Notifications

### This project is a **URL Shortener** service that allows users to create short, shareable links with advanced features like email-based authentication, access notifications, and expiration dates. It is designed to provide secure and controlled access to shared URLs.

### Deployed at https://secret-url-site.vercel.app/
---


https://github.com/user-attachments/assets/ae593028-4120-47ae-b0df-63893700ee91

![Screenshot 2025-04-07 020840](https://github.com/user-attachments/assets/18ea30d5-9dfd-4df9-a7f5-928fcbdc99dd)


![Screenshot 2025-04-07 020823](https://github.com/user-attachments/assets/51896f06-7a85-45d6-b3ab-ff6073198609)

## Project Overview

### **1. Server**
- **Purpose:** Handles backend logic, including URL shortening, authentication, and email notifications.
- **Tech Stack:** Node.js, Firebase Firestore, Express.js
- **Key Features:**
  - Shortens URLs and stores them in Firebase Firestore.
  - Supports email-based authentication for accessing protected URLs.
  - Sends email notifications when URLs are accessed.
  - Handles URL expiration logic.

### **2. Client**
- **Purpose:** Provides a user-friendly interface for creating and managing short URLs.
- **Tech Stack:** React, Vite, TailwindCSS
- **Key Features:**
  - Allows users to create short URLs with optional expiration dates and access restrictions.
  - Implements an authentication flow for accessing protected URLs.
---

## API Endpoints

### **1. Create Short URL**
- **Endpoint:** `POST /shorten`
- **Purpose:** Creates a short URL with optional expiration and access restrictions.
- **Example Use Case:** A user wants to share a link that expires in 7 days and is accessible only to specific email addresses.

---

### **2. Verify Email**
- **Endpoint:** `POST /auth/verify-email`
- **Purpose:** Sends a verification code to the user's email to authenticate access to a protected URL.
- **Example Use Case:** A user tries to access a protected URL and needs to verify their email.

---

### **3. Verify Code**
- **Endpoint:** `POST /auth/verify-code`
- **Purpose:** Verifies the code sent to the user's email and grants access to the original URL.
- **Example Use Case:** A user enters the verification code they received to access the URL.

---

### **4. Resend Verification Code**
- **Endpoint:** `POST /auth/resend-code`
- **Purpose:** Resends the verification code to the user's email.
- **Example Use Case:** A user did not receive the verification code and requests it again.

---

### **5. Redirect to Original URL**
- **Endpoint:** `GET /:shortId`
- **Purpose:** Redirects to the original URL if no authentication is required, or to the authentication page if access is restricted.
- **Example Use Case:** A user clicks on a short URL and is redirected to the appropriate destination.

---

### **6. Check URL Requirements**
- **Endpoint:** `POST /checkurl`
- **Purpose:** Checks if a short URL requires authentication to access.
- **Example Use Case:** The client checks if a URL requires sign-in before proceeding.

---

## How It Works

1. **Create a Short URL:** Users provide the original URL, optional expiration date, and access restrictions.
2. **Share the Short URL:** The generated short URL can be shared with others.
3. **Access the URL:**
   - If unrestricted, users are redirected to the original URL.
   - If restricted, users must verify their email to access the URL.
4. **Notifications:** The owner of the URL receives an email notification when someone accesses the URL (if enabled).

---

## Getting Started

### **Server**
1. Navigate to the `/server` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with Firebase and email credentials.
4. Start the server: `node server.js`

### **Client**
1. Navigate to the `/client` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file with the backend URL.
4. Start the client: `npm run dev`

---

## Key Features
- **Secure Sharing:** Restrict access to specific email addresses.
- **Expiration Dates:** Set a time limit for URL validity.
- **Notifications:** Get notified when someone accesses your URL.
- **User-Friendly Interface:** Easy-to-use client for creating and managing URLs.

---

## Environment Variables

### **Server**
- `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` (Firebase config)
- `EMAIL_USER`, `EMAIL_PASS` (Email credentials)
- `FRONTEND_URL` (Client URL)

### **Client**
- `VITE_BACKEND_URL` (Server URL)

---

## License
This project is licensed under the MIT License.
