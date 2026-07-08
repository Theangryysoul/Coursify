# Coursify – Development Guide

**Version:** 1.0.0  
**Status:** Frozen

---

# Table of Contents

1. Development Philosophy
2. Tech Stack
3. Project Structure
4. Coding Standards
5. Git Workflow
6. Branching Strategy
7. Commit Convention
8. Development Workflow
9. Code Review Checklist
10. Testing Checklist
11. Documentation Rules
12. Engineering Principles

---

# 1. Development Philosophy

Coursify is built with the following principles:

- Readability over clever code
- Consistency over personal preference
- Simplicity over unnecessary abstraction
- Business logic belongs in services
- Every feature should align with the PRD

Before writing code, ask:

> "Does this implementation match the PRD?"

If not, revisit the design before coding.

---

# 2. Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Zod
- Multer
- Cloudinary

---

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Framer Motion

---

## Tools

- Git
- GitHub
- Postman
- VS Code
- ESLint
- Prettier

---

# 3. Project Structure

Backend

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

Every folder has one responsibility.

---

# 4. Coding Standards

## Naming

Variables

```ts
const currentUser
const courseProgress
```

Functions

```ts
getCurrentUser()

importCourse()

updateProgress()
```

Classes

```ts
UserService

BadRequestError
```

Files

```
user.service.ts

auth.controller.ts

course.routes.ts
```

---

## General Rules

- Use TypeScript everywhere.
- Avoid `any`.
- Prefer descriptive names.
- Keep functions small.
- Avoid duplicate code.
- Remove unused imports.

---

## Controllers

Controllers should:

- Read request
- Call service
- Return response

Controllers should NOT:

- Query MongoDB directly
- Calculate progress
- Call external APIs

---

## Services

Services contain business logic.

Examples

- Import YouTube Course
- Calculate Progress
- Update Dashboard
- Authentication

---

## Models

Models define database schema only.

Business logic belongs in services.

---

# 5. Git Workflow

Workflow

```
Code

↓

Test

↓

Commit

↓

Push

↓

Merge
```

Commit only working code.

Never commit broken builds.

---

# 6. Branching Strategy

Main Branch

```
main
```

Feature Branches

Examples

```
feature/auth

feature/youtube-import

feature/dashboard

feature/progress-engine
```

Bug Fixes

```
fix/avatar-upload

fix/login
```

---

# 7. Commit Convention

Format

```
type: short description
```

Examples

```
feat: add JWT authentication

feat: implement avatar upload

fix: resolve refresh token bug

refactor: move business logic to service

docs: update API documentation

style: format code

test: add auth tests
```

---

# 8. Development Workflow

For every feature:

1. Update documentation (if required)
2. Create validator
3. Create service
4. Create controller
5. Create route
6. Test using Postman
7. Refactor if needed
8. Commit changes

---

# 9. Code Review Checklist

Before committing:

- Code builds successfully
- No TypeScript errors
- No unused imports
- No console.log()
- Validation added
- Error handling added
- Services used correctly
- Response format consistent

---

# 10. Testing Checklist

Authentication

- Register
- Login
- Logout
- Refresh Token

Users

- Profile
- Avatar
- Password

YouTube

- Playlist Import
- Single Video Import

Progress

- Resume
- Completion
- Progress Saving

Dashboard

- Statistics
- Continue Learning
- Heatmap

Collections

- CRUD Operations

Goals

- Daily Goal
- Weekly Goal

---

# 11. Documentation Rules

Whenever architecture changes:

Update

- PRD
- Architecture
- Database
- API

Documentation is the source of truth.

Code should follow documentation.

---

# 12. Engineering Principles

- Thin Controllers
- Business Logic in Services
- Validation before Controllers
- Secure by Default
- Single Source of Truth
- RESTful APIs
- Soft Delete over Permanent Delete
- Progress is Calculated, Never Manually Set

---

# Development Philosophy

Understand before implementing.

Implement before optimizing.

Optimize only after measuring.

Every commit should leave the project in a better state than before.