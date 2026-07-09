POST /api/v1/auth/login

{
  "email": "john@example.com",
  "password": "Password@123"
}

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}

POST /api/v1/youtube/preview

{
  "success": true,
  "message": "Preview fetched successfully",
  "data": {
    "type": "playlist",
    "data": {
      "title": "React Course",
      "thumbnail": "...",
      "channelName": "Hitesh Choudhary",
      "videoCount": 64,
      "videos": [
        {
          "videoId": "...",
          "title": "...",
          "duration": "PT10M15S",
          "position": 1
        }
      ]
    }
  }
}


POST /api/v1/youtube/import

{
  "url": "https://www.youtube.com/playlist?list=PL..."
}

{
  "success": true,
  "message": "Course imported successfully",
  "data": {
    "_id": "...",
    "owner": "...",
    "course": "..."
  }
}


GET /api/v1/courses

{
  "success": true,
  "message": "Courses fetched successfully",
  "data": [
    {
      "_id": "...",
      "course": {
        "title": "React Course",
        "thumbnail": "...",
        "channelName": "Hitesh Choudhary"
      },
      "favorite": false,
      "pinned": false,
      "status": "In Progress",
      "progress": 45
    }
  ]
}


GET /api/v1/courses/{courseId}

{
  "success": true,
  "message": "Course fetched successfully",
  "data": {
    "userCourse": {
      "_id": "...",
      "favorite": false,
      "status": "In Progress"
    },
    "progress": 45,
    "videos": [
      {
        "_id": "...",
        "title": "Introduction",
        "duration": "PT8M15S",
        "position": 1
      }
    ]
  }
}


PATCH /api/v1/courses/{courseId}

{
  "favorite": true,
  "pinned": true,
  "status": "In Progress",
  "archived": false
}

{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "_id": "...",
    "favorite": true,
    "pinned": true,
    "status": "In Progress"
  }
}


GET /api/v1/progress/{youtubeVideoId}

{
  "success": true,
  "message": "Resume fetched successfully",
  "data": {
    "currentTime": 120,
    "completed": false,
    "watchedSegments": [
      {
        "start": 110,
        "end": 120
      }
    ]
  }
}


PATCH /api/v1/progress/{youtubeVideoId}

{
  "currentTime": 120,
  "duration": 600,
  "segment": {
    "start": 110,
    "end": 120
  }
}

{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "currentTime": 120,
    "uniqueWatchedSeconds": 10,
    "completed": false
  }
}


GET /api/v1/progress/stats

{
  "success": true,
  "message": "Learning statistics fetched successfully",
  "data": {
    "totalCourses": 8,
    "completedVideos": 42,
    "totalWatchTime": 18540,
    "formattedWatchTime": "5h 9m",
    "streak": 7
  }
}

GET /

{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 1234.56,
  "timestamp": "2026-07-09T12:00:00.000Z"
}