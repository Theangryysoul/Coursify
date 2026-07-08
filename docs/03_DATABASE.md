# Coursify – Database Design

**Version:** 1.0.0  
**Status:** Frozen  
**Database:** MongoDB  
**ODM:** Mongoose

---

# Table of Contents

1. Design Principles
2. Database Collections
3. Collection Relationships
4. Collection Schemas
5. Indexing Strategy
6. Soft Delete Strategy
7. Progress Engine
8. Entity Relationship Diagram
9. Future Scope
10. Database Philosophy

---

# 1. Design Principles

The database follows these principles:

- Single Source of Truth
- Avoid Data Duplication
- Separate shared course metadata from user-specific learning data
- Soft Delete wherever applicable
- Scalable architecture
- Read-optimized for dashboard

---

# 2. Database Collections

```
users
playlists
videos
userCourses
watchProgress
collections
goals
studySessions
```

---

## Why this Architecture?

Shared YouTube metadata is stored once.

```
React Playlist
        │
        ├── Video 1
        ├── Video 2
        ├── Video 3
```

Each user creates their own learning record.

```
Jerry
    │
    └── UserCourse

Alex
    │
    └── UserCourse
```

This avoids duplicating playlists and videos for every user.

---

# 3. Collection Relationships

```
User
├── UserCourses
├── Collections
├── Goals
└── StudySessions

Course (playlists collection)
└── Videos

UserCourse
├── User
└── Course

WatchProgress
├── UserCourse
└── Video
```

---

# 4. Collection Schemas

## users

Purpose

Stores authentication and profile information.

Fields

```
_id
name
email
password
avatar
bio
theme
role
isDeleted
deletedAt
createdAt
updatedAt
```

Avatar

```
url
publicId
```

Role

```
user
admin
```

Theme

```
light
dark
system
```

---

## playlists (Course Metadata)

Purpose

Stores shared metadata for a Coursify Course imported from YouTube.

A course may originate from:

- YouTube Playlist
- Single YouTube Video

Fields

```
_id
type
title
description
thumbnail
channelName
channelId
playlistId
playlistUrl
videoCount
totalDuration
importSource
lastSyncedAt
createdAt
updatedAt
```

type

```
playlist
single-video
```

importSource

```
youtube
```

---

## videos

Purpose

Stores metadata for every YouTube video.

Fields

```
_id
course
videoId
youtubeUrl
title
description
thumbnail
duration
position
createdAt
```

Relationship

```
Course
    │
    └── Videos
```

---

## userCourses

Purpose

Represents a course inside a user's personal learning library.

Fields

```
_id
owner
course
status
favorite
pinned
archived
createdAt
updatedAt
```

Status

```
Not Started
In Progress
Completed
Archived
```

One Course can belong to multiple user collections.

---

## watchProgress

Purpose

Stores progress for every video of a UserCourse.

Fields

```
_id
userCourse
video
currentTime
duration
watchedSegments
uniqueWatchDuration
completed
completedAt
lastWatchedAt
updatedAt
```

watchedSegments

Example

```
[
  [0,120],
  [120,300],
  [600,900]
]
```

After Merge

```
[
  [0,300],
  [600,900]
]
```

Completion Logic

- Video ended naturally

OR

- 95% Unique Watch Duration

---

## collections

Purpose

User-created folders for organizing courses.

Examples

```
DSA
AI
React
Interview Prep
```

Fields

```
_id
owner
name
description
courseIds
createdAt
updatedAt
```

Relationship

```
Collection

↓

Many UserCourses

UserCourse

↓

Many Collections
```

(Many-to-Many)

---

## goals

Purpose

Stores user learning goals.

Fields

```
_id
user
dailyMinutes
weeklyMinutes
deadline
createdAt
updatedAt
```

---

## studySessions

Purpose

Stores daily learning statistics.

Fields

```
_id
user
date
minutesLearned
videosCompleted
coursesStudied
createdAt
```

Used For

- Heatmap
- Weekly Analytics
- Monthly Analytics
- Study Streak
- Consistency Score

---

# 5. Indexing Strategy

users

```
email (unique)
```

playlists

```
playlistId
```

videos

```
course
videoId
```

userCourses

```
owner
course
```

watchProgress

```
userCourse
video
```

collections

```
owner
```

goals

```
user
```

studySessions

```
user
date
```

---

# 6. Soft Delete Strategy

Applied only to Users.

```
isDeleted

deletedAt
```

Benefits

- Prevent accidental deletion
- Account recovery
- Audit history

---

# 7. Progress Engine

Resume Watching

Stores

```
currentTime
lastWatchedAt
```

Auto Save

Every

```
10 seconds
```

Also on

- Pause
- Video End
- Switching Videos
- Browser Close (best effort)

Completion

```
Video End

OR

95% Unique Watch Duration
```

Course Progress

Calculated dynamically from video progress.

Never stored.

---

# 8. Entity Relationship Diagram

```
User
│
├──────────────┐
│              │
▼              ▼
UserCourse     Collection
│
▼
Course (playlists)
│
▼
Video
│
▼
WatchProgress

User
│
├── Goals
│
└── StudySessions
```

---

# 9. Future Scope

Future collections may include

```
notifications
certificates
flashcards
aiNotes
```

No existing schema changes required.

---

# 10. Database Philosophy

- Shared course metadata exists only once.
- Every user owns an independent learning library.
- Progress belongs to the user, not the course.
- Dashboard analytics are calculated from real learning activity.
- Database normalization is preferred over duplicated data.