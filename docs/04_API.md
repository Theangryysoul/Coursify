# Coursify – API Documentation

**Version:** 1.0.0  
**Status:** Frozen  
**Architecture:** REST API  
**Base URL:** `/api/v1`

---

# Table of Contents

1. API Standards
2. Authentication
3. Users
4. YouTube Import
5. Courses
6. Videos & Progress
7. Collections
8. Goals
9. Dashboard
10. Settings
11. Admin
12. Response Format
13. Status Codes
14. API Versioning

---

# 1. API Standards

## Base URL

```
/api/v1
```

---

## Authentication

Protected routes require an Access Token.

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## Content Types

JSON

```
application/json
```

File Upload

```
multipart/form-data
```

---

# 2. Authentication

## Register

```
POST /auth/register
```

Create a new account.

---

## Login

```
POST /auth/login
```

Returns

- Access Token
- Refresh Token Cookie

---

## Logout

```
POST /auth/logout
```

Invalidates Refresh Token.

---

## Refresh Token

```
POST /auth/refresh
```

Generates a new Access Token.

---

# 3. Users

## Current User

```
GET /users/me
```

Returns

- Profile
- Avatar
- Theme
- Role

---

## Update Profile

```
PATCH /users/profile
```

Updates

```
name
bio
```

---

## Update Avatar

```
PATCH /users/avatar
```

Upload avatar.

---

## Change Password

```
PATCH /users/password
```

---

# 4. YouTube Import

## Preview

```
POST /youtube/preview
```

Purpose

Validate URL and preview metadata before importing.

Request

```json
{
  "url": "https://youtube.com/..."
}
```

Response

```
Type
Title
Thumbnail
Channel
Video Count
Total Duration
```

---

## Import

```
POST /youtube/import
```

Purpose

Import a playlist or single video into the user's learning library.

Flow

```
Validate URL

↓

Fetch Metadata

↓

Find Existing Course

↓

Create Course (if required)

↓

Create UserCourse

↓

Return Imported Course
```

---

# 5. Courses

## Get My Courses

```
GET /courses
```

Supports

- Search
- Filter
- Sort
- Pagination

Query Parameters

```
?page=
&limit=
&search=
&status=
&favorite=
&pinned=
&collection=
```

---

## Get Course Details

```
GET /courses/:id
```

Returns

- Course Metadata
- Videos
- Resume Timestamp
- Progress

---

## Update Course

```
PATCH /courses/:id
```

Allowed Updates

```
favorite
pinned
status
archived
```

---

## Archive Course

```
DELETE /courses/:id
```

Soft archive only.

---

# 6. Videos & Progress

## Get Video

```
GET /videos/:id
```

Returns

- Metadata
- Resume Timestamp
- Progress

---

## Save Progress

```
PATCH /videos/:id/progress
```

Request

```json
{
  "currentTime": 1820,
  "watchedSegment": [1810, 1820]
}
```

Responsibilities

- Save Timestamp
- Merge Watched Segments
- Calculate Unique Watch Duration
- Update Study Session

---

## Completion

There is **no API** to manually mark a video as completed.

A video is completed automatically when:

- Video ends naturally

OR

- 95% unique watch duration has been watched.

---

# 7. Collections

## Get Collections

```
GET /collections
```

---

## Create Collection

```
POST /collections
```

---

## Update Collection

```
PATCH /collections/:id
```

---

## Delete Collection

```
DELETE /collections/:id
```

---

## Add Course

```
POST /collections/:id/course
```

Request

```json
{
  "courseId": "..."
}
```

---

## Remove Course

```
DELETE /collections/:id/course/:courseId
```

---

# 8. Goals

## Get Goal

```
GET /goals
```

---

## Update Goal

```
PATCH /goals
```

Request

```json
{
  "dailyMinutes": 90,
  "weeklyMinutes": 720
}
```

---

# 9. Dashboard

## Dashboard

```
GET /dashboard
```

Returns

```
Continue Learning

Pinned Courses

Recently Added

Learning Insights

Statistics

Weekly Progress

Consistency Score

Estimated Completion
```

---

## Analytics

```
GET /dashboard/analytics
```

Returns

- Total Learning Hours
- Remaining Hours
- Study Streak
- Course Progress

---

## Heatmap

```
GET /dashboard/heatmap
```

Returns

```
Date
Minutes Learned
```

Frontend renders the GitHub-style heatmap.

---

# 10. Settings

## Update Theme

```
PATCH /settings/theme
```

---

## Delete Account

```
DELETE /settings/account
```

Soft delete.

---

# 11. Admin

Purpose

Platform moderation only.

---

## Users

```
GET /admin/users
```

Supports

- Search
- Pagination

---

## Get User

```
GET /admin/users/:id
```

---

## Ban User

```
PATCH /admin/users/:id/ban
```

---

## Unban User

```
PATCH /admin/users/:id/unban
```

---

## Delete User

```
DELETE /admin/users/:id
```

Soft delete.

---

## Restore User

```
PATCH /admin/users/:id/restore
```

---

## Platform Statistics

```
GET /admin/statistics
```

Returns

- Total Users
- Active Users
- Imported Courses
- Total Learning Hours

---

# 12. Response Format

## Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

# 13. HTTP Status Codes

```
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error
```

---

# 14. API Versioning

Current Version

```
/api/v1
```

Future breaking changes

```
/api/v2
```

---

# API Philosophy

- RESTful API Design
- Thin Controllers
- Business Logic in Services
- Validation Before Controllers
- Consistent Response Format
- Authentication for Protected Routes
- Soft Delete Over Permanent Delete
- Single Source of Truth
- Progress Calculated, Never Manually Updated