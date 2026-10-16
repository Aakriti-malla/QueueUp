# Social Media Post Scheduler

A responsive social media post scheduler built with Next.js, TypeScript, and Tailwind CSS. It provides a dashboard to manage scheduled posts, filter content, compose new posts, and retry failed posts.

The project uses mock data and an in-memory API to simulate common post-scheduling workflows without requiring a backend or external social media integrations.

## Features

### Post Queue
- View 30 mock posts grouped by day, including Today, Tomorrow, and upcoming dates.
- Preview post content, attached media, scheduled time, target platforms, and publication status.
- Distinguish between scheduled, published, and failed posts.

### Search and Filters
- Search posts by their content.
- Filter posts by one or multiple social media platforms.
- Filter by post status using a dropdown.
- Persist search and filter selections in URL query parameters, allowing filtered views to be bookmarked or shared.

### Post Composer
- Compose posts with text, selected platforms, and an optional image URL.
- Display live character counts for each selected platform.
- Prevent scheduling when content exceeds the selected platforms' limits.
- Require a valid future scheduling date and time.

### Scheduling and Time Zones
- Store scheduled timestamps in UTC using ISO 8601 format.
- Display scheduled times in the user's local time zone.

### Retry Failed Posts
- Retry posts that have failed.
- Simulate a one-second API request with a 20% chance of failure.
- Restore the previous state and display an error message if the retry fails.

### User Experience
- Responsive layout for desktop and mobile screens.
- Loading, empty, and error states.
- Mock asynchronous API requests to simulate real application behavior.

## Tech Stack

- **Next.js** — App Router
- **TypeScript** — Static typing
- **Tailwind CSS** — Styling and responsive layouts
- **pnpm** — Package management

## Getting Started

### Prerequisites

- Node.js (a version supported by your installed Next.js version)
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <your-project-directory>
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Model

Each post follows this TypeScript structure:

```ts
export type Platform =
  | "facebook"
  | "instagram"
  | "x"
  | "tiktok";

export type PostStatus =
  | "scheduled"
  | "published"
  | "failed";

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  mediaUrl?: string;
  scheduledAt: string;
  status: PostStatus;
  errorMessage?: string;
}
```

## Technical Decisions

### In-memory Mock API

The application uses an in-memory mock API to simulate asynchronous operations such as fetching posts, creating posts, and retrying failed posts.

This keeps the project self-contained and makes it possible to demonstrate loading states, optimistic updates, and error handling without setting up a backend.

**Limitation:** Posts are not persisted to a database. Refreshing the application resets the mock data, and changes are not shared across users or sessions.

### URL-based Filtering

Search terms, platform selections, and status filters are stored in URL query parameters. This keeps the interface state reflected in the URL and makes filtered views easier to revisit.

### UTC Timestamp Storage

Scheduled timestamps are stored in UTC and converted to local time for display. This separates the stored timestamp from the user's local time zone.

### Optimistic Updates

The retry workflow updates the interface before the simulated API request completes. If the request fails, the previous state is restored and an error is shown to the user.
