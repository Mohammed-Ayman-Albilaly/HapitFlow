# Detailed Requirements Specification: HabitFlow

## 1. Business Context
HabitFlow is a premium habit-tracking platform designed to motivate users through a high-end, futuristic visual experience. The goal is to move beyond simple checklists and provide a "gamified" feel through streaks, progress visualizations, and a polished UI.

## 2. User Personas
- **The High-Achiever (Alex)**: Needs data-driven consistency tracking and a professional, dark-mode interface.
- **The Life-Resetter (Maya)**: Needs simple "wins" and clear visual feedback to rebuild routines.

## 3. Scope

### In Scope
- **Authentication**: JWT-based signup/login, bcrypt password hashing, session expiration.
- **Habit Management**: Full CRUD. Users can create **custom categories**.
- **Tracking System**: Mark habits as complete for **today only** (No retroactive completion).
- **Streak Engine**: 
    - **Daily**: Reset if a single day is missed.
    - **Weekly**: Continues if completed at least once per calendar week.
- **Dashboard**: High-end visuals including a **Heatmap** (activity density) and a **Bar Chart** (weekly progress).
- **Futuristic UI**: Dark theme, glassmorphism, smooth transitions, responsive layout.

### Out of Scope
- Social features, push notifications, and retroactive habit marking.

---

## 4. User Stories & Acceptance Criteria

### Epic 1: Identity & Access
- **US.1**: As a user, I want to create an account. (**Given** `/register`, **When** valid email/pass provided, **Then** account created).
- **US.2**: As a user, I want to log in securely. (**Given** existing account, **When** correct credentials, **Then** JWT returned).

### Epic 2: Habit & Category Management
- **US.3**: As a user, I want to create a habit with a custom category. (**Given** "Add Habit" form, **When** I enter a new category name, **Then** the category is saved and linked to the habit).
- **US.4**: As a user, I want to edit/delete habits. (**Given** an existing habit, **When** I modify or delete, **Then** changes persist).

### Epic 3: Tracking & Streak Logic
- **US.5**: As a user, I want to mark a habit as complete for today. (**Given** today's date, **When** I click complete, **Then** a record is created. **Note**: Retroactive marking is disabled).
- **US.6**: As a user, I want my daily streak to track consecutive days. (**Given** a daily habit, **When** I miss one day, **Then** the streak resets to 0).
- **US.7**: As a user, I want my weekly streak to track weekly consistency. (**Given** a weekly habit, **When** I complete it once within the calendar week, **Then** the streak continues).

### Epic 4: Visualization
- **US.8**: As a user, I want to see a heatmap of my activity. (**Given** historical data, **When** viewing dashboard, **Then** a grid shows completion density over time).
- **US.9**: As a user, I want to see a bar chart of my weekly progress. (**Given** last 7 days, **When** viewing dashboard, **Then** a chart shows daily completion counts).

---

## 5. Entity Relationship (ER) Overview

- **User**: `id`, `email`, `password` (hashed), `createdAt`.
- **Category**: `id`, `userId` (FK), `name`, `color`. (Now a separate entity to support custom categories).
- **Habit**: `id`, `userId` (FK), `categoryId` (FK), `title`, `description`, `frequency` (Daily/Weekly), `createdAt`.
- **Completion**: `id`, `habitId` (FK), `userId` (FK), `completedAt` (Date).

---

## 6. Non-Functional Requirements (NFRs)

### Performance
- **Latency**: API responses must be under 300ms for standard CRUD and dashboard operations.
- **Frontend**: Smooth 60fps animations for glassmorphic transitions.

### Security
- **Hashing**: All passwords must be hashed using `bcrypt`.
- **Isolation**: Strict middleware to ensure `userId` from JWT matches the requested resource.
- **Auth**: JWTs must have a defined expiration period.

### Maintainability
- **Architecture**: Modular backend (Controllers $\rightarrow$ Services $\rightarrow$ Routes).
- **Code Quality**: Reusable React components and consistent Tailwind utility patterns.

### Testing
- **Logic**: Dedicated unit tests for the Streak Calculation engine (Daily vs Weekly).
- **Integration**: End-to-end API tests for the Auth and Tracking flows.

---

## 7. API Requirements (Summary)
- `POST /api/auth/register` & `/login`
- `GET/POST/PATCH/DELETE /api/habits`
- `POST /api/habits/:id/complete` (Today only)
- `GET /api/dashboard` (Returns Heatmap and Bar Chart data)
- `GET/POST /api/categories` (Manage custom categories)

## 8. Edge Cases
- **Double Completion**: Idempotent API (one record per habit per day).
- **Streak Reset**: Daily streak resets at 00:00:00 of the next day if not completed.
- **Empty State**: Beautiful "Welcome" UI for users with no habits.
