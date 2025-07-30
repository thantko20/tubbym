# Introduction

tubbyM is a video-streaming service like Youtube that allows users to upload, share, and watch videos.
It is designed to be user-friendly and efficient, providing a seamless experience for both content creators and viewers.
It supports adaptive streaming, which adjusts the video quality based on the user's internet connection speed. It makes use of HLSL (HTTP Live Streaming) for video delivery, ensuring compatibility across various devices and platforms.

# Repository

This repository is responsible for the backend of tubbyM, uploading the videos via S3 Pre-signed URLs.
Video processing is handled by a separate service, which is not included in this repository.
So, this repository focuses on the CRUD operations of tubbyM.

# Technologies

- **Node.js** for runtime and backend server
- **TanStack Start** for building this fullstack application
- **TypeScript** for type safety and better development experience
- **AWS S3** for video storage and retrieval
- **HLS** for adaptive video streaming
- **Clerk** for user authentication and management
- **Prisma** as an ORM for database interactions

# Features

- User authentication and management using Clerk
- Video upload functionality with S3 Pre-signed URLs
- CRUD operations for videos (processing not included in this repository)
- Adaptive streaming using HLS
- Reactions and comments on videos
- Search functionality for videos
- Thumbnail generation for videos (handled by the video processing service)
- Playlists and subscriptions for users (Like Youtube)
