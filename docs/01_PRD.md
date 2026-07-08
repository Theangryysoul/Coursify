# Coursify – Product Requirements Document (PRD)

**Version:** 1.0.0  
**Status:** Draft
**Author:** Jerry  
**Project Type:** Personal Learning Platform (PLP)  
**Last Updated:** July 2026

---

# 1. Vision

Coursify is a distraction-free Personal Learning Platform that transforms YouTube videos and playlists into a structured learning experience.

Instead of learning directly on YouTube—with endless recommendations, comments, and distractions—users import educational content into Coursify, where progress, goals, analytics, and learning consistency are tracked automatically.

The objective is to help learners stay focused, organized, and consistent.

---

# 2. Problem Statement

Millions of people learn from YouTube every day.

However, YouTube is built for engagement rather than learning.

Current problems include:

- Endless recommendations
- No structured learning library
- No meaningful progress tracking
- Difficult to resume where you left off
- No learning analytics
- No study consistency
- No long-term learning goals

Coursify solves these problems by creating a focused learning environment around YouTube content.

---

# 3. Goals

## Primary Goals

- Build a personal learning library.
- Eliminate unnecessary distractions.
- Track learning accurately.
- Help users stay consistent.
- Provide meaningful learning analytics.

## Secondary Goals

- Clean and intuitive UI.
- Fast performance.
- Mobile-friendly experience.
- Scalable architecture.
- Production-ready backend.

---

# 4. Target Users

- College students
- Self-taught developers
- Competitive exam aspirants
- Professionals learning new skills
- Anyone using YouTube as their primary learning platform

---

# 5. Core Philosophy

Every feature must answer one question:

> **"Does this help someone learn YouTube courses with less distraction and better consistency?"**

If the answer is **No**, the feature should not be added.

---

# 6. Engineering Principles

- Simplicity over unnecessary complexity.
- User experience over feature quantity.
- Performance before premature optimization.
- Single source of truth for data.
- Thin controllers.
- Business logic belongs in services.
- One responsibility per module.
- Every feature should support the core vision.

---

# 7. Non Goals (V1)

Coursify is **NOT**:

- A YouTube replacement
- A video hosting platform
- A social media platform
- A Learning Management System (LMS) for instructors
- A marketplace for selling courses

---

# 8. Product Flow

```
YouTube Import

        ↓

Personal Learning Library

        ↓

Progress Engine

        ↓

Learning Analytics

        ↓

Dashboard
```

---

# 9. Core Features (V1)

## Authentication

- Register
- Login
- Logout
- Refresh Token
- JWT Authentication
- Profile Management
- Avatar Upload

---

## YouTube Import

- Import Playlist URL
- Import Single Video URL
- Fetch Metadata
- Playlist Thumbnail
- Video Count
- Total Duration
- Creator Information

---

## Personal Learning Library

- My Courses
- Search
- Filter
- Sort
- Favorites
- Pin Course
- Archive Course
- User Collections
- One course can belong to multiple collections

---

## Video Player

- Embedded YouTube Player
- Resume Watching
- Playback Speed
- Fullscreen
- Auto Next Video
- Distraction-Free Experience

---

## Progress Tracking

- Resume Timestamp
- Watched Segments
- Auto Save Progress
- Smart Completion Detection
- Video Progress
- Course Progress

Progress is calculated automatically and cannot be manually completed.

---

## Dashboard

### Hero Section

- Continue Learning

### Statistics

- Total Courses
- Total Videos
- Total Learning Hours
- Remaining Learning Hours

### Learning

- Weekly Progress
- Daily Goal
- Study Heatmap
- Study Streak
- Learning Insights
- Consistency Score
- Estimated Completion
- Recently Added Courses
- Pinned Courses

---

## Collections

Users can organize courses into custom collections.

Examples:

- DSA
- AI
- Web Development
- Placement Preparation

Features:

- Create
- Edit
- Delete
- Add Courses
- Remove Courses

---

## Settings

- Profile
- Theme (Dark / Light)
- Change Password
- Delete Account

---

# 10. Video Tracking Engine

## Resume Watching

Store:

- User
- Course
- Lecture
- Current Timestamp
- Duration
- Last Watched Time

---

## Auto Save

Save progress every:

- 10 seconds
- Pause
- Video End
- Switching Videos
- Page Close (best effort)

---

## Completion Logic

Lecture is completed when:

- Video ends naturally

OR

- 95% of unique video duration has been watched

---

## Watched Segments

Instead of storing only the latest timestamp, Coursify stores watched ranges.

Example:

```
0–120

120–300

600–900
```

Merged into:

```
0–300

600–900
```

Progress is calculated using unique watched duration.

---

# 11. Learning Analytics

- Daily Learning Time
- Weekly Learning Time
- Monthly Learning Time
- Total Learning Time
- Study Streak
- Heatmap
- Daily Goal Progress
- Consistency Score
- Estimated Course Completion

---

# 12. User Experience

Empty states should guide users instead of showing blank screens.

Examples:

- No Courses
- No Collections
- No Goals
- Nothing to Resume

Every empty state should encourage the next meaningful action.

---

# 13. Admin Panel (Minimal)

Purpose:

Platform administration only.

Features:

- View Users
- Soft Delete Users
- Restore Users
- Ban / Unban Users
- Remove abusive content
- Platform Analytics

Admins **cannot create courses** because courses belong to individual users.

---

# 14. Future Scope (V2)

Possible future additions:

- AI Learning Assistant
- Flashcards
- AI Quiz Generation
- AI Notes
- Certificates
- Multi-platform Imports
- Calendar Integration
- Social Features

---

# 15. Success Criteria

Coursify successfully achieves its vision if users can:

- Import YouTube playlists or videos.
- Learn without distractions.
- Resume exactly where they left off.
- Track meaningful progress.
- Stay consistent with learning goals.
- Organize learning into a personal library.
- Gain actionable insights from their study habits.

---

# Version History

| Version | Date | Changes |
|----------|------|---------|
| 1.0.0 | July 2026 | Initial frozen PRD |