# Coursify – System Architecture

**Version:** 1.0.0  
**Status:** Frozen  
**Project:** Coursify  
**Architecture Style:** Layered Architecture (REST API)

---

# Table of Contents

1. Architecture Overview
2. High-Level System Design
3. Design Principles
4. Backend Architecture
5. Frontend Architecture
6. Request Lifecycle
7. Module Responsibilities
8. External Services
9. Authentication Flow
10. YouTube Import Flow
11. Progress Tracking Flow
12. Dashboard Flow
13. Folder Structure
14. Security
15. Scalability
16. Future Architecture

---

# 1. Architecture Overview

Coursify follows a layered architecture that separates responsibilities into independent modules.

```
Frontend

↓

Routes

↓

Middleware

↓

Controllers

↓

Services

↓

Database / External APIs
```

Each layer has exactly one responsibility.

---

# 2. High-Level System Design

```
                    ┌──────────────────────┐
                    │   React Frontend     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    └──────────┬───────────┘
                               │
         ┌─────────────────────┼──────────────────────┐
         │                     │                      │
         ▼                     ▼                      ▼
   MongoDB               Cloudinary          YouTube Data API
```

---

# 3. Design Principles

Coursify follows these engineering principles.

## Single Responsibility

Every module has one job.

Example

Route

Defines endpoints only.

Controller

Handles Request and Response.

Service

Contains business logic.

Database

Stores data.

---

## Thin Controllers

Controllers should never contain business logic.

Good

```
Controller

↓

Service

↓

Database
```

Bad

```
Controller

↓

100 lines of business logic
```

---

## Business Logic in Services

Services are responsible for:

- Importing playlists
- Progress calculation
- Dashboard statistics
- Learning insights

Controllers never calculate anything.

---

## Single Source of Truth

Shared metadata exists once.

User-specific progress exists separately.

Examples

Playlist Metadata

↓

Shared

Progress

↓

Per User

---

## Scalable by Default

Every new feature should require minimal changes to existing modules.

---

# 4. Backend Architecture

```
Routes

↓

Middleware

↓

Controllers

↓

Services

↓

Models

↓

MongoDB
```

---

## Routes

Responsibilities

- Define API endpoints
- Attach middleware
- Connect controller

Never

- Validate business logic
- Query database

---

## Middleware

Responsibilities

- Authentication
- Validation
- Upload Handling
- Error Handling

Examples

authenticate

validate

upload

---

## Controllers

Responsibilities

- Read Request
- Call Service
- Return Response

Controllers never:

- Query YouTube
- Calculate progress
- Update statistics

---

## Services

Services contain business logic.

Examples

Auth Service

User Service

YouTube Service

Course Service

Progress Service

Dashboard Service

Collection Service

Goal Service

---

## Models

Models communicate with MongoDB only.

Models never contain business logic.

---

# 5. Frontend Architecture

```
Pages

↓

Components

↓

API Layer

↓

Backend
```

---

## Pages

Examples

Landing

Dashboard

My Courses

Course Details

Collections

Settings

---

## Components

Reusable UI

Examples

Navbar

Sidebar

Course Card

Progress Ring

Heatmap

Resume Card

---

## API Layer

Responsible for

- API Requests
- Authentication
- Error Handling

No UI logic.

---

# 6. Request Lifecycle

Example

```
GET /courses
```

```
Client

↓

Route

↓

Authentication Middleware

↓

Controller

↓

Service

↓

MongoDB

↓

Controller

↓

JSON Response
```

---

# 7. Module Responsibilities

## Authentication

Responsible for

- Register
- Login
- Logout
- JWT
- Refresh Tokens

---

## User

Responsible for

- Profile
- Avatar
- Settings

---

## YouTube

Responsible for

- URL Validation
- Metadata Fetching
- Playlist Import

---

## Course

Responsible for

- Personal Learning Library
- Favorites
- Pinning
- Archive
- Status

---

## Video

Responsible for

- Video Metadata
- Ordering
- Resume

---

## Progress

Responsible for

- Watch Tracking
- Watched Segments
- Completion
- Course Progress

---

## Dashboard

Responsible for

- Analytics
- Continue Learning
- Learning Insights
- Statistics

---

## Collections

Responsible for

- Organizing Courses

---

## Goals

Responsible for

- Daily Goal
- Weekly Goal
- Estimated Completion

---

# 8. External Services

## MongoDB

Stores

- Users
- Shared Course Metadata
- Videos
- User Library
- Progress
- Collections
- Goals
- Study Sessions

---

## Cloudinary

Stores

- User Avatar

Future

- Generated Assets

---

## YouTube Data API v3

Provides

- Playlist Metadata
- Video Metadata
- Duration
- Thumbnails
- Channel Information

---

# 9. Authentication Flow

```
Login

↓

Generate JWT

↓

Access Token

↓

HTTP-only Refresh Cookie

↓

Protected APIs

↓

Authentication Middleware

↓

Verified User
```

---

# 10. YouTube Import Flow

```
Paste URL

↓

Validate URL

↓

Detect

Playlist

or

Single Video

↓

Fetch Metadata

↓

Check Existing Course

↓

Create Shared Course (if needed)

↓

Create User Course

↓

Dashboard
```

Notice

Shared metadata is created once.

Every user gets their own learning entry.

---

# 11. Progress Tracking Flow

```
Watch Video

↓

Save Timestamp

↓

Merge Watched Segments

↓

Calculate Unique Watch Duration

↓

Update Progress

↓

Update Study Session

↓

Dashboard
```

Completion

Video End

OR

95% Unique Watch Duration

---

# 12. Dashboard Flow

```
Dashboard Request

↓

Fetch User Courses

↓

Fetch Progress

↓

Fetch Study Sessions

↓

Generate Analytics

↓

Return Dashboard
```

Dashboard should never calculate anything on the frontend.

Everything is calculated on the backend.

---

# 13. Folder Structure

```
src/

config/

controllers/

middleware/

models/

routes/

services/

validators/

utils/

types/
```

Responsibilities

config

Application configuration

controllers

Request handling

middleware

Authentication & validation

models

MongoDB schemas

routes

API endpoints

services

Business logic

validators

Zod validation

utils

Shared helpers

types

Shared TypeScript types

---

# 14. Security

Authentication

JWT

Refresh Tokens

HTTP-only Cookies

---

Validation

Zod

---

Passwords

bcrypt

---

Uploads

Cloudinary

Multer

---

Environment

dotenv

Zod Validation

---

Soft Delete

User accounts are never permanently deleted.

---

# 15. Scalability

Architecture supports future additions.

Examples

Admin Dashboard

AI Assistant

Flashcards

Certificates

Notifications

Calendar Integration

Mobile App

Multi-platform Imports

without major restructuring.

---

# 16. Engineering Philosophy

Coursify is designed around one central idea.

```
YouTube

↓

Personal Learning Library

↓

Progress Engine

↓

Learning Analytics

↓

Dashboard
```

Every new feature should strengthen this flow.

If a feature does not improve learning, organization, or consistency, it should not be added.

---

# Architecture Summary

Frontend

↓

REST API

↓

Express Backend

↓

Services

↓

MongoDB

+

Cloudinary

+

YouTube Data API

The backend owns all business logic.

The frontend is responsible only for presentation.

Shared metadata is stored once.

Learning progress belongs to individual users.

The architecture prioritizes maintainability, scalability, and clear separation of responsibilities.