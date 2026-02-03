# Backend-Nest — Project README
## Project Overview

Backend-Nest is a modular, scalable backend application built with NestJS and TypeScript. This project demonstrates advanced backend development patterns and integrations, including real-time communication (SSE and WebSockets), streaming (HLS), caching, background processing, authentication, security, logging, and third-party integrations.

The backend is designed to support features such as real-time text chat, image and video uploads, video streaming via HLS, and robust system infrastructure with caching, queueing, and logging.

## Key Features

### Core Framework

- Built using NestJS, a progressive Node.js framework for building efficient and scalable server applications.

### Database & ORM

- Integrated with TypeORM for database modeling, migrations, and entity relationships.

- Supports relational databases (e.g., PostgreSQL).

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

### Queueing & Background Jobs

- BullMQ for high-performance job queues and background processing.

- Manages tasks such as media processing, notifications.

### Logging

- Structured and centralized logging via Winston, capturing system logs, request logs, and error tracking.

### Third-Party Integrations

- Supabase integration for storage.

- Extensible for future integrations and microservices.

## Modules

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

- API endpoints, frequently accessed queries, cached in Redis.

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

- Entities and repositories for core resources such as users, chats, messages, and videos.

- Supports migrations.

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

- Utilizes Supabase services for file storage.

## Architectural Highlights
### Modular Design

- The application is divided into feature-centric modules, making it easy to maintain, test, and extend.

### Real-Time & Streaming

- Designed to efficiently support real-time interactions, live messaging, and adaptive video streaming using industry-standard protocols like WebSockets and HLS.

### Scalability

- With Redis caching, BullMQ queueing, and modular event pipelines, the project is built for scalability and high throughput.

## 🧱 Tech Stack

- **Node.js** / **TypeScript**
- **NestJS** – Application framework
- **TypeORM** – Database ORM
- **PostgreSQL** - Primary Database
- **FFmpeg** – Video processing
- **WebSockets** – Real-time communication
- **BullMQ** – Background jobs & async processing
- **hCaptcha** – Bot protection
- **Redis** – Caching

## 📁 Project Structure

```text
db/
├── factories/
├── migrations/
├── seeders/
├── seed.ts
├── seeder.config.ts
├── typeorm.config.ts

dist/

logs/
├── server
├── client

src/
├── auth/
├── user/
├── ffmpeg/
├── files/
├── h-captcha/
├── organization/
├── permission/
├── post/
├── product/
├── queue/
├── role/
├── storage/
├── video/
├── websocket/
├── notification/
├── cache/
├── common/
├── config/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── test/

package.json
package-lock.json
tsconfig.json
README.md

- Each module encapsulates a domain of responsibility with services, controllers, and providers.
```

## ⚙️ Installation

### Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL
- Redis (optional, for cache & queues)
- FFmpeg (for video processing)

### Install Dependencies
```bash
npm install
```

## Environment Configuration
### Create a .env file in the project root:

```bash
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# Authentication
JWT_SECRET=your-jwt-secret

# hCaptcha
HCAPTCHA_SECRET=your-hcaptcha-secret

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Database Migrations
### Run database migrations to create tables and schemas:

```bash
npm run typeorm migration:run
```

### Revert Last Migration (if needed)
```bash
npm run typeorm migration:revert
```

## Start the Application
### Development Mode

```bash
npm run start:dev
```

The server will start at:
```bash
http://localhost:3000
```

## Build Output
- Compiled files are generated in the dist/ directory

- Logs are written to:

    - logs/server

    - logs/client