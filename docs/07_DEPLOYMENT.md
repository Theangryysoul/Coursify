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
Railway
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
Railway
```

Requirements

- Node.js Runtime
- Build Command
- Start Command
- Environment Variables

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