# Coursify – Security Documentation

**Version:** 1.0.0  
**Status:** Frozen

---

# Table of Contents

1. Security Principles
2. Authentication
3. Authorization
4. Password Security
5. JWT Security
6. API Security
7. File Upload Security
8. Database Security
9. Input Validation
10. Environment Variables
11. Security Headers
12. Error Handling
13. Logging
14. Future Improvements

---

# 1. Security Principles

Coursify follows these principles:

- Secure by Default
- Least Privilege
- Validate Every Input
- Never Trust Client Data
- Keep Sensitive Data Server-side
- Protect User Privacy

---

# 2. Authentication

Authentication uses:

- JWT Access Token
- Refresh Token
- HTTP-only Cookies

Access Token

- Short-lived
- Sent with protected requests

Refresh Token

- Used to obtain a new Access Token
- Never accessible through JavaScript

---

# 3. Authorization

Protected routes require authentication.

Examples

```
GET /users/me
PATCH /users/profile
POST /youtube/import
GET /dashboard
```

Admin routes additionally verify:

```
role === "admin"
```

---

# 4. Password Security

Passwords are:

- Never stored in plain text
- Hashed using bcrypt
- Compared using bcrypt.compare()

Users cannot retrieve their password.

Password changes require:

- Current Password
- New Password

---

# 5. JWT Security

Access Token

- Short expiration
- Contains minimal user information

Payload

```
userId
email
role
```

Never store:

- Password
- Avatar
- Personal information

JWT secrets are stored only in environment variables.

---

# 6. API Security

Every protected endpoint verifies:

- Authentication
- Authorization (if required)
- Request validation

Invalid requests return appropriate HTTP status codes.

---

# 7. File Upload Security

Avatar Upload

Allowed

- JPG
- JPEG
- PNG
- WEBP

Rejected

- Executables
- Scripts
- Unsupported file types

Limits

- Maximum Size: 150 KB
- One file per request

Images are stored in Cloudinary.

Only the image URL and publicId are stored in MongoDB.

---

# 8. Database Security

Sensitive fields are excluded by default.

Example

```
password
select: false
```

Soft Delete is used for user accounts.

```
isDeleted

deletedAt
```

Database queries always use Mongoose models.

---

# 9. Input Validation

Validation is performed using Zod.

Examples

- Register
- Login
- Update Profile
- Import Course
- Goals

Requests failing validation return HTTP 422.

---

# 10. Environment Variables

Sensitive configuration is stored in:

```
.env
```

Examples

```
PORT

NODE_ENV

MONGODB_URI

JWT_ACCESS_SECRET

JWT_REFRESH_SECRET

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

YOUTUBE_API_KEY
```

`.env` is never committed.

`.env.example` is committed.

---

# 11. Security Headers

Recommended middleware

Helmet

Provides protection against common HTTP attacks.

Enable CORS only for trusted frontend origins.

---

# 12. Error Handling

Never expose:

- Stack traces
- Database queries
- Internal implementation

Production responses should return only:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

Detailed errors should only be logged on the server.

---

# 13. Logging

Log

- Authentication failures
- Server errors
- Upload failures
- YouTube API failures

Never log

- Passwords
- JWT Secrets
- Refresh Tokens
- Environment Variables

---

# 14. Future Improvements

Planned enhancements

- Email Verification
- Forgot Password
- Password Reset Tokens
- Rate Limiting
- Account Lockout
- CSRF Protection
- Refresh Token Rotation
- Audit Logs
- Two-Factor Authentication (2FA)

---

# Security Philosophy

Security should protect users without affecting usability.

Every request is validated.

Every protected route is authenticated.

Sensitive information is never exposed.

Security decisions prioritize user privacy, data integrity, and maintainability.