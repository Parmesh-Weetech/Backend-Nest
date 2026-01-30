# Backend-Nest — Project README
## Project Overview

Backend-Nest is a modular, scalable backend application built with NestJS and TypeScript. This project demonstrates advanced backend development patterns and integrations, including real-time communication (SSE and WebSockets), streaming (HLS), caching, background processing, authentication, security, logging, and third-party integrations.

The backend is designed to support features such as real-time text chat, image and video uploads, video streaming via HLS, and robust system infrastructure with caching, queueing, and logging.

## Key Features

### Core Framework

- Built using NestJS, a progressive Node.js framework for building efficient and scalable server applications.

### Database & ORM

- Integrated with TypeORM for database modeling, migrations, and entity relationships.

- Supports relational databases (e.g., PostgreSQL, MySQL).

### Real-Time Functionality

- WebSockets with Socket.IO for bi-directional real-time communication.

- Text-based live chat with support for image and video uploads.

- HTTP Live Streaming (HLS) integration for video playback using WebSockets to coordinate streaming events.

### Server-Sent Events (SSE)

- Unidirectional server-to-client event streaming for real-time notifications and updates without WebSockets.

### Authentication & Security

- Token-based authentication, enabling secure REST APIs and authenticated WebSocket connections.

- Rate limiting to protect APIs from abuse.

- h-captcha integration to validate user interactions and reduce bot traffic.

### Caching

- Redis caching to improve response performance and scalability.

- Used in API caching, session cache, rate-limit counters, and real-time optimization.

### Queueing & Background Jobs

- BullMQ for high-performance job queues and background processing.

- Manages tasks such as media processing, notifications, and deferred jobs.

### Logging

- Structured and centralized logging via Winston, capturing system logs, request logs, and error tracking.

### Third-Party Integrations

- Supabase integration for storage, database, and authentication extensions.

- Extensible for future integrations and microservices.

## Modules and Capabilities

### Real-Time Communication

- WebSocket gateway supporting:

    - Real-time chat messaging
    - Room management and broadcast
    - Client connection lifecycle
    - Media upload orchestration

- HLS streaming support to serve adaptive video segments and playlists.

- Chat media workflows supporting images and videos.

### Video Streaming

- Manages HLS playlists and segment delivery for video streaming.

- Coordinates video streaming state via WebSockets.

- Supports video upload, transcoding trigger via queue jobs, and playlist generation.

### Caching with Redis

- API endpoints, frequently accessed queries, and session data are cached in Redis.

- Enables multi-node cache sharing.

- Reduces database load and increases throughput.

### Queueing & Background Jobs (BullMQ)

- Handles long-running and CPU-intensive tasks.

- Example background jobs include:

    - Video transcoding
    - Thumbnail generation
    - Email and notification delivery
    - Scheduled and delayed jobs

### Database and ORM (TypeORM)

- Relational database support with TypeORM.

- Entities and repositories for core resources such as users, chats, messages, videos, and sessions.

- Supports migrations and database versioning.

### Authentication & Access Control

- Token-based authentication with access and refresh tokens.

- Permission and role checks for protected routes and real-time channels.

- Secure WebSocket authentication handshake.

### SSE (Server-Sent Events)

- Provides real-time updates to clients over HTTP.

- Ideal for dashboards, notifications, live scoring, and event streams.

### Security Features

- Rate limiting to protect APIs and reduce abuse.

- h-captcha integration to validate human interactions for sensitive endpoints.

- Secure upload handling with validations and size limits.

### Logging with Winston

- Centralized logging with levels (info, warn, error).

- Structured output suitable for log aggregates and monitoring.

- Request/response logging for audit and debugging.

### Supabase Integration

- Utilizes Supabase services for extended database access, storage, authentication, and API extensions.

- Improves frontend-backend interaction.

## Architectural Highlights
Modular Design

The application is divided into feature-centric modules, making it easy to maintain, test, and extend.

Real-Time & Streaming

Designed to efficiently support real-time interactions, live messaging, and adaptive video streaming using industry-standard protocols like WebSockets and HLS.

Scalability

With Redis caching, BullMQ queueing, and modular event pipelines, the project is built for scalability and high throughput.

Topics Covered (Detailed Overview)

Server-Sent Events (SSE)
Real-time, unidirectional streams from the server to clients, ideal for push notifications.

WebSockets (Socket.IO)
Full-duplex communication enabling real-time chat, presence tracking, and event dispatch.

HLS Integration
Adaptive media streaming for video delivery through HLS playlists and segment serving.

Image and Video Uploads
Chat and media endpoints support file uploads, integrated with Supabase and background processors.

Token-Based Authentication
Secure login and token refresh mechanism with access control.

Rate Limiting
API protection to prevent brute-force and flood requests.

h-captcha Integration
Human verification for forms and endpoints.

Caching with Redis
Improved performance and reduced latency through Redis caches.

Background Jobs with BullMQ
Asynchronous processing for heavy tasks like media processing.

Winston Logging
Structured, level-based logging for operational monitoring.

Supabase Integration
Enhances storage, authentication, and real-time capabilities with an external platform.

Project Structure (Conceptual)
modules/
├── auth/
├── users/
├── chat/
├── streaming/
├── media/
├── notifications/
├── queue/
├── cache/
├── logs/
common/
services/
events/
config/
database/


Each module encapsulates a domain of responsibility with services, controllers, and providers.