# iChat

Real-time chat application with authentication, user profiles (including profile picture upload), and messaging over WebSockets.

## Features

- Authentication (register, login, logout) using **JWT in httpOnly cookies**
- Auth session check endpoint (`/auth/check`)
- Profile picture upload (base64 upload -> **Cloudinary**)
- Real-time messaging with **Socket.IO**
- Contacts list and chat history
- Basic API protection/rate limiting via **Arcjet** middleware

## Tech Stack

### Frontend

- React (Vite)
- Zustand (state management)
- TailwindCSS + daisyUI
- Axios
- Socket.IO Client

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT (httpOnly cookie)
- Cloudinary (media uploads)
- Arcjet (rate limiting / protection)

## Project Structure

- `frontend/` — React app
- `backend/` — Express + Socket.IO server

## Prerequisites

- Node.js (LTS recommended)
- MongoDB connection string (MongoDB Atlas or local)
- Cloudinary account (for profile pictures / image messages)

## Setup

### 1) Clone and install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 2) Environment variables

Create `.env` files in both `backend/` and `frontend/`.

#### `backend/.env`

The backend uses these variables (based on the code in `backend/server.js`, `backend/config/db.js`, `backend/utils/generateToken.js`, and `backend/config/cloudinary.js`):

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (if configured)
RESEND_API_KEY=your_resend_api_key
```

Notes:

- `MONGODB_URI` is used like `${MONGODB_URI}/iChat` in `backend/config/db.js`.
- Cookies are set as `httpOnly` and will use:
  - `secure: true` only in production
  - `sameSite: "none"` in production, `"strict"` in development

#### `frontend/.env`

Frontend uses `VITE_API_URL` for non-development builds (see `frontend/src/lib/axios.js`).

```env
VITE_API_URL=http://localhost:3000/
```

In development mode, the frontend automatically uses `http://localhost:3000/`.

### 3) Run the app (development)

#### Start backend

```bash
cd backend
npm run dev
```

Backend starts on `http://localhost:3000` by default.

#### Start frontend

```bash
cd frontend
npm run dev
```

Frontend starts on `http://localhost:5173` by default.

## API Routes (Backend)

Base URL: `http://localhost:3000`

### Auth (`/auth`)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/check` (requires auth cookie)
- `PUT /auth/update-profile` (requires auth cookie)

### Messages (`/messages`)

- `GET /messages/contacts` (requires auth cookie)
- `GET /messages/chats` (requires auth cookie)
- `GET /messages/:id` (requires auth cookie)
- `POST /messages/send/:id` (requires auth cookie)

## Real-time (Socket.IO)

- Socket server is created in `backend/utils/socket.js`.
- Socket connections are authenticated using the `jwt` cookie (`backend/middlewares/socketAuth.js`).

## Production Notes

- Configure `CLIENT_URL` to your deployed frontend URL.
- Ensure cookies work across domains:
  - backend must enable CORS with `credentials: true`
  - cookie `sameSite`/`secure` must match your deployment (HTTPS required for `sameSite=none`).

## Scripts

### Backend (`backend/package.json`)

- `npm run dev` — start server with nodemon
- `npm start` — start server

### Frontend (`frontend/package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
