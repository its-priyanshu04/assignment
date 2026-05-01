# Backend Setup

## Prerequisites
- Node.js 18+
- MongoDB running locally or cloud URI

## Environment
1. Copy `.env.example` to `.env`
2. Set values:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`

## Run
```bash
npm install
npm run dev
```

## API Base URL
`http://localhost:5000`

## Endpoints
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `GET /projects`
- `POST /projects`
- `DELETE /projects/:projectId`
- `PATCH /projects/:projectId/members/add`
- `PATCH /projects/:projectId/members/remove`
- `GET /tasks`
- `GET /tasks/dashboard/summary`
- `POST /tasks`
- `PATCH /tasks/:taskId/status`
- `DELETE /tasks/:taskId`
- `GET /users`
