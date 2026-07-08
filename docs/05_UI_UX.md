# Coursify – UI / UX Specification

**Version:** 1.0.0  
**Status:** Frozen

---

# Table of Contents

1. Design Principles
2. Navigation
3. User Flow
4. Pages
5. Components
6. Empty States
7. Loading States
8. Error States
9. Responsive Design
10. UX Principles

---

# 1. Design Principles

Coursify focuses on learning, not entertainment.

Design goals:

- Minimal
- Distraction-free
- Fast
- Consistent
- Accessible

Every screen should help users continue learning with as few clicks as possible.

---

# 2. Navigation

```
Landing

↓

Login / Register

↓

Dashboard

├── My Courses
├── Collections
├── Goals
├── Settings
└── Profile
```

---

# 3. User Flow

## New User

```
Landing

↓

Register

↓

Dashboard

↓

Import Course

↓

Course Imported

↓

Start Learning
```

---

## Returning User

```
Login

↓

Dashboard

↓

Continue Learning

↓

Video Player
```

---

# 4. Pages

## Landing Page

Sections

- Hero
- Features
- How It Works
- FAQ
- CTA

Primary Action

```
Get Started
```

---

## Login

Fields

- Email
- Password

Actions

- Login
- Forgot Password
- Register

---

## Register

Fields

- Name
- Email
- Password
- Confirm Password

---

## Dashboard

Sections

### Hero

Continue Learning

Shows

- Course Thumbnail
- Course Title
- Current Video
- Resume Timestamp
- Remaining Time
- Resume Button

---

### Learning Insights

Displays

- Study Streak
- Weekly Hours
- Consistency Score
- Daily Goal Progress

---

### Statistics

- Total Courses
- Total Videos
- Hours Learned
- Hours Remaining

---

### Progress

- Weekly Progress
- Heatmap

---

### Pinned Courses

Pinned courses always appear first.

---

### Recently Added

Recently imported courses.

---

## My Courses

Functions

- Grid/List View
- Search
- Filter
- Sort

Course Card

Shows

- Thumbnail
- Title
- Creator
- Progress
- Status
- Favorite
- Pin
- Last Studied

Actions

- Open
- Archive

---

## Import Course

Input

```
YouTube Playlist URL

or

Single Video URL
```

Preview

- Thumbnail
- Title
- Channel
- Duration
- Video Count

Actions

```
Import
```

---

## Course Details

Sections

### Header

- Thumbnail
- Title
- Creator
- Progress

---

### Playlist

Displays

- Video List
- Completed Videos
- Current Video

---

### Insights

Displays

- Hours Completed
- Remaining Hours
- Completion Percentage

---

Primary Action

```
Continue Learning
```

---

## Video Player

Layout

```
+--------------------------------------+
|          YouTube Player              |
+--------------------------------------+

Course Progress

Video Information

Playlist Sidebar

Previous    Next
```

Features

- Resume Watching
- Playback Speed
- Fullscreen
- Auto Next
- Progress Auto Save

No

- Comments
- Recommendations
- Related Videos

---

## Collections

Displays

User-created collections.

Actions

- Create
- Edit
- Delete

Open Collection

Displays

Courses inside collection.

---

## Goals

Displays

- Daily Goal
- Weekly Goal
- Estimated Completion

Actions

- Update Goal

---

## Profile

Displays

- Avatar
- Name
- Email
- Join Date

Actions

- Edit Profile
- Change Avatar

---

## Settings

Options

- Theme
- Change Password
- Delete Account
- Logout

---

# 5. Components

Global Components

- Navbar
- Sidebar
- Footer

Cards

- Course Card
- Continue Learning Card
- Statistics Card
- Insight Card

Inputs

- Search
- URL Input
- Forms

Feedback

- Toast
- Modal
- Confirmation Dialog

Indicators

- Progress Bar
- Circular Progress
- Skeleton Loader

---

# 6. Empty States

## No Courses

```
🎓 Welcome to Coursify

Import your first YouTube course.

[Import Course]
```

---

## No Collections

```
📁 No Collections

Create your first collection.

[Create Collection]
```

---

## No Goals

```
🎯 Set Your Goal

Stay consistent by setting a daily target.

[Set Goal]
```

---

## Nothing to Resume

```
📺 Nothing to Resume

Import a course and start learning.
```

---

# 7. Loading States

Use Skeleton Loaders for

- Dashboard
- Courses
- Player
- Collections

Buttons

Disable while requests are processing.

---

# 8. Error States

Show friendly messages.

Examples

```
Unable to import course.

Try again.
```

```
Network Error.

Check your connection.
```

Always provide a retry action where appropriate.

---

# 9. Responsive Design

Supported Devices

Desktop

Tablet

Mobile

Behavior

Desktop

- Sidebar expanded

Tablet

- Collapsible sidebar

Mobile

- Bottom navigation
- Drawer menu

---

# 10. UX Principles

- Continue Learning is always the primary action.
- Dashboard should be useful within 5 seconds.
- Important actions require at most 2 clicks.
- Never lose user progress.
- Minimize typing.
- Prefer visual feedback over alerts.
- Keep learning distraction-free.

---

# UX Philosophy

Coursify is not designed to maximize screen time.

It is designed to maximize learning consistency.

Every interaction should help users:

- Start learning quickly.
- Continue where they left off.
- Understand their progress.
- Stay motivated without unnecessary distractions.