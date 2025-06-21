# Clubhouse Clone Project Documentation

## 1. Project Overview

The Clubhouse Clone project is a full-stack web application that replicates the core functionalities of the Clubhouse social audio app. It enables users to sign in, join audio chat rooms, and interact with other participants in real-time. The project leverages modern web technologies and the Stream Video SDK to provide seamless video and audio communication.

---

## 2. Client (Frontend)

### Technology Stack
- React
- TypeScript
- Vite (build tool)
- Stream Video React SDK
- React Router for client-side routing

### Structure and Main Components
- **MainPage** (`/`): The landing page of the application.
- **SignInPage** (`/sign-in`): Page for user authentication and sign-in.
- **RoomPage** (`/room`): The main room interface where users participate in audio/video calls. This route is protected and requires an active call context.

### User Context and Call Management
- The app uses a user context (`user-context.tsx`) to manage user state and call information.
- The `StreamCall` component from the Stream Video SDK wraps the RoomPage to provide real-time communication capabilities.

### Routing
- Implemented using `react-router-dom`.
- Routes:
  - `/` → MainPage
  - `/sign-in` → SignInPage
  - `/room` → RoomPage (protected, requires active call)
  - `*` → 404 Not Found page

---

## 3. Server (Backend)

### Technology Stack
- Node.js
- Express
- TypeScript
- Stream Node SDK

### Server Setup
- Express server configured with JSON body parsing and CORS middleware.
- Environment variables managed via `dotenv`.

### Routes
- **Authentication Route** (`/auth/createUser`):
  - POST endpoint to create or update a user.
  - Accepts `username`, `name`, and optional `image` in the request body.
  - Uses Stream client to upsert users and generate authentication tokens with 24-hour expiry.
  - Returns a JSON response containing the token and user information.
  - Handles validation and error responses.

---

## 4. Deployment Guide

### Frontend Deployment (React + Vite)
- Recommended platforms: Vercel, Netlify
- Build commands:
  ```bash
  cd client
  npm install
  npm run build
  ```
- Deployment:
  - Vercel: Use `npx vercel` or connect GitHub repo.
  - Netlify: Drag and drop `client/dist` folder or connect GitHub repo with build command `npm run build` and publish directory `client/dist`.

### Backend Deployment (Node.js + Express)
- Recommended platforms: Render, Railway, Fly.io, Heroku
- Preparation:
  - Add start script in `server/package.json`:
    ```json
    "start": "node dist/index.js"
    ```
  - Build backend:
    ```bash
    cd server
    npm install
    npx tsc
    ```
- Deployment:
  - Connect GitHub repo to chosen platform.
  - Configure build command: `npm install && npx tsc`
  - Configure start command: `npm start`
  - Set environment variables as needed.
  - Deploy and note backend URL.

### Connecting Frontend and Backend
- Update frontend API calls to use deployed backend URL.
- Redeploy frontend if necessary.

---

## 5. Additional Notes

### Environment Variables
- Backend uses environment variables for configuration (e.g., PORT, Stream API keys).
- Use `.env` files or platform-specific environment variable settings.

### Error Handling
- Backend routes return appropriate HTTP status codes and error messages.
- Frontend handles protected routes and redirects unauthenticated users.

### Security Considerations
- Authentication tokens have limited expiry (24 hours).
- Use HTTPS in production deployments.
- Secure environment variables and API keys.

---

This documentation provides a comprehensive overview of the Clubhouse Clone project, including its architecture, setup, and deployment instructions.
