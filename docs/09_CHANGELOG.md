# Coursify – Changelog

**Project:** Coursify  
**Current Version:** 1.0.0  
**Status:** Active Development

---

# Changelog Format

Each release follows Semantic Versioning.

```
MAJOR.MINOR.PATCH

Example

1.0.0
```

- **MAJOR** → Breaking changes
- **MINOR** → New features
- **PATCH** → Bug fixes and small improvements

---

# Version History

## [1.0.0] - July 2026

### Added

#### Documentation

- Product Requirements Document (PRD)
- System Architecture
- Database Design
- API Documentation
- UI / UX Specification
- Security Documentation
- Deployment Guide
- Development Guide
- Changelog

#### Backend

- Project setup
- Express + TypeScript configuration
- MongoDB connection
- Environment validation using Zod
- Global error handling
- Async handler
- JWT Authentication
- Refresh Token Authentication
- Authentication middleware
- User registration
- User login
- User logout
- Current user endpoint
- Profile update
- Avatar upload
- Cloudinary integration
- Password hashing using bcrypt

---

### Changed

- Standardized API response format.
- Moved business logic into service layer.
- Adopted layered architecture.
- Separated shared course metadata from user-specific learning data.

---

### Security

- HTTP-only Refresh Token
- Password hashing
- Zod request validation
- Environment variable validation
- Secure avatar upload
- Soft delete strategy

---

### Documentation

Created the following documents:

- 01_PRD.md
- 02_ARCHITECTURE.md
- 03_DATABASE.md
- 04_API.md
- 05_UI_UX.md
- 06_SECURITY.md
- 07_DEPLOYMENT.md
- 08_DEVELOPMENT_GUIDE.md
- 09_CHANGELOG.md

---

## Upcoming (v1.1)

Planned implementation

- YouTube Import
- Personal Learning Library
- Progress Engine
- Dashboard
- Collections
- Goals
- Heatmap
- Learning Insights

---

# Release Notes

## v1.0.0

This release establishes the technical foundation of Coursify.

The backend architecture, database design, API contracts, security guidelines, deployment strategy, and development standards have been finalized.

Future development will follow the documentation created during this phase.

---

# Breaking Changes

None.

---

# Migration Notes

Not applicable.

---

# Contributors

Project Owner

- Jerry

Development Support

- OpenAI ChatGPT (Architecture, Documentation, Code Review, Technical Mentoring)

---

# Notes

Every future update should:

- Increment the project version.
- Record newly added features.
- Record breaking changes.
- Record important bug fixes.
- Keep historical entries unchanged.

This document serves as the official release history of the project.