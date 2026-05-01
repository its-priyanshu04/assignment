# Task Manager Assignment

A full-stack task and project management application with a Node.js + Express backend and a React + Vite frontend.

## Repository Structure

- `backend/` - REST API for authentication, projects, tasks, and user management
- `frontend/` - React application with pages for login, signup, dashboard, projects, and tasks

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication
- bcryptjs
- express-validator
- dotenv
- CORS, Helmet, Morgan

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- ESLint

## Setup Instructions

### 1. Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Configure environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
5. Start the backend:
   ```bash
   npm run dev
   ```

The backend server should run on `http://localhost:5000` by default.

### 2. Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will launch a Vite development server, typically at `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate and receive a token
- `GET /auth/me` - Get current authenticated user

### Projects
- `GET /projects` - List projects
- `POST /projects` - Create a project
- `DELETE /projects/:projectId` - Delete a project
- `PATCH /projects/:projectId/members/add` - Add a member to a project
- `PATCH /projects/:projectId/members/remove` - Remove a member from a project

### Tasks
- `GET /tasks` - List tasks
- `GET /tasks/dashboard/summary` - Get dashboard task summary
- `POST /tasks` - Create a task
- `PATCH /tasks/:taskId/status` - Update task status
- `DELETE /tasks/:taskId` - Delete a task

### Users
- `GET /users` - List users

## Notes

- Ensure MongoDB is running locally or provide a cloud MongoDB URI.
- The frontend expects the backend API to be available at `http://localhost:5000` unless configured otherwise.
- Use the React context provider in `src/context/AuthContext.jsx` to manage authentication state.

## Helpful Commands

### Backend
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend with Node

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint

## Contact

If you need help with local setup or API integration, open an issue or reach out to the project maintainer.
