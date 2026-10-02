# Coursify – Deployment Guide

**Version:** 1.0.0  
**Status:** Frozen

---

# Table of Contents

1. Deployment Goals
2. Technology Stack
3. Environments
4. Backend Deployment
5. Frontend Deployment
6. Database
7. Cloudinary
8. YouTube API
9. Environment Variables
10. Deployment Checklist
11. Post Deployment
12. Monitoring
13. Future Improvements

---

# 1. Deployment Goals

Deployment should provide:

- Reliable production environment
- Secure configuration
- Easy updates
- Zero hardcoded secrets
- Fast frontend delivery
- Scalable backend

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Hosting

```
Vercel
```

---

## Backend

- Express
- TypeScript
- Node.js

Hosting

```
Vercel (Vercel Services, same project as the frontend)
```

---

## Database

```
MongoDB Atlas
```

---

## File Storage

```
Cloudinary
```

---

## External API

```
YouTube Data API v3
```

---

# 3. Environments

## Development

Purpose

- Local development
- Debugging
- Feature implementation

```
NODE_ENV=development
```

---

## Production

Purpose

- Live application

```
NODE_ENV=production
```

---

# 4. Backend Deployment

Platform

```
Vercel Services
```

The API is deployed from the same repository and the same Vercel project as the
frontend. `vercel.json` at the repository root declares both services:

```json
{
  "services": {
    "client": { "root": "client", "framework": "vite" },
    "server": { "root": "server", "framework": "express" }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": { "service": "server" } },
    { "source": "/(.*)", "destination": { "service": "client" } }
  ]
}
```

Vercel turns the Express app into a single serverless function. The entrypoint is
`server/src/server.ts`, which exports the app and only opens a port when it is
not running on Vercel.

Two rules make the server work as a function:

- `server/src/app.ts` connects to MongoDB before any `/api/v1` route runs, so a
  cold instance never serves a request without a connection.
- `server/src/config/database.ts` caches the connection instead of opening a new
  one per request.

Project settings in the Vercel dashboard:

```
Root Directory      repository root (leave empty)
Framework Preset    Other
Build Command       (default - each service builds itself)
Install Command     (default - pnpm workspace install)
Output Directory    (default - each service has its own)
```

Requirements

- Node.js Runtime
- Environment Variables
- MongoDB Atlas network access for Vercel (see section 6)

Backend Responsibilities

- Authentication
- API
- Progress Engine
- Dashboard
- YouTube Import

---

# 5. Frontend Deployment

Platform

```
Vercel
```

Responsibilities

- React Application
- Static Assets
- Client Routing

The client is a single page application, so the `client` service rewrites every
unmatched path to `/index.html` (declared in `vercel.json`). Deep links such as
`/courses/123` are handled by React Router instead of returning 404.

API calls go to the same origin:

```
/api/v1
```

Vercel routes `/api/*` to the `server` service, so the browser sees one origin.
Cookies (the refresh token) and CORS therefore work without extra configuration,
and no production API URL has to be baked into the bundle.

Locally the same path is served by the Vite dev proxy, which forwards `/api` to
`http://localhost:5000` (see `client/vite.config.ts`).

Frontend communicates only with Backend APIs.

---

# 6. Database

Platform

```
MongoDB Atlas
```

Requirements

- Production Cluster
- IP Access Configuration
- Strong Database Password
- Regular Backups

Vercel Functions do not have static outbound IP addresses on the Hobby and Pro
plans, so the Atlas IP Access List must allow `0.0.0.0/0` (or a Vercel Static
IP once one is configured). Keep the database user restricted to the `coursify`
database to limit the exposure.

---

# 7. Cloudinary

Purpose

Store user avatars.

Only store in MongoDB

```
url

publicId
```

Never store image files inside MongoDB.

---

# 8. YouTube API

Uses

```
YouTube Data API v3
```

Production

Restrict API Key by

```
Server IP Address
```

Development

```
No restriction
```

API Key is stored in

```
.env
```

---

# 9. Environment Variables

Required

```
PORT

NODE_ENV

CLIENT_URL

MONGODB_URI

JWT_ACCESS_SECRET

JWT_REFRESH_SECRET

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

YOUTUBE_API_KEY
```

Rules

- Never commit `.env`
- Commit `.env.example`
- Validate using Zod

## Vercel

Set these in the Vercel project (Settings → Environment Variables → Production
and Preview). Both services read the same set.

```
MONGODB_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
YOUTUBE_API_KEY
```

Also set

```
CLIENT_URL     https://<your-deployment>.vercel.app
NODE_ENV       production
```

`CLIENT_URL` accepts a comma separated list of allowed browser origins. Requests
from the deployment's own origin are always allowed, so with the same-origin
`/api` rewrite this value is only needed for extra origins.

`VITE_API_URL` is optional and does not need to be set on Vercel: the client
defaults to `/api/v1` on the same origin. Only set it when the API lives on a
different domain.

Do not set `PORT` on Vercel; it is only used by the local server.

---

# 10. Deployment Checklist

Backend

- Environment Variables Added
- MongoDB Connected
- Cloudinary Connected
- YouTube API Connected
- Build Successful
- APIs Tested

Frontend

- API Base URL Updated
- Environment Variables Added
- Build Successful
- Routes Working
- Responsive Layout Verified

Vercel

- Root Directory left empty
- `pnpm build` succeeds for both services
- `/api/v1/health` returns `200` on the deployment URL
- Deep link (e.g. `/courses`) loads the app instead of `404`
- Sign in sets the `refreshToken` cookie on the deployment domain

---

# 11. Post Deployment

Verify

- User Registration
- Login
- Avatar Upload
- Import Playlist
- Import Video
- Progress Tracking
- Dashboard
- Collections
- Goals

Check

- Console Errors
- Network Requests
- Database Records
- Cloudinary Uploads

---

# 12. Monitoring

Monitor

- Backend Availability
- API Response Time
- MongoDB Connection
- Cloudinary Upload Errors
- YouTube API Errors

Regularly review server logs for unexpected failures.

---

# 13. Future Improvements

- Custom Domain
- HTTPS Enforcement
- CI/CD Pipeline
- Automatic Deployment
- Database Backups
- Error Monitoring
- Performance Monitoring

---

# Deployment Philosophy

Deploy the same application that was tested locally.

Configuration should change between environments, not application code.

Production secrets must always remain outside the repository.

Deployment should be repeatable, secure, and require minimal manual steps.