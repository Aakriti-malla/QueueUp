"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";

import type { Post, PostStatus } from "@/types/post";
import PlatformIcon from "@/components/PlatformIcon";

interface PostCardProps {
  post: Post;
  onRetry: (id: string) => void;
  isRetrying: boolean;
}

const statusDetails: Record<
  PostStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  published: {
    label: "Published",
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export default function PostCard({
  post,
  onRetry,
  isRetrying,
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);

  const status = statusDetails[post.status];
  const scheduledDate = new Date(post.scheduledAt);

  const formattedTime = scheduledDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {post.mediaUrl && !imageError && (
          <a
            href={post.mediaUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="View attached media"
            className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-16"
          >
            <img
              src={post.mediaUrl}
              alt="Post media"
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          </a>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-gray-900 sm:text-base">
              {post.content}
            </p>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div
              className="flex items-center gap-2"
              aria-label={`Platforms: ${post.platforms.join(", ")}`}
            >
              {post.platforms.map((platform) => (
                <PlatformIcon key={platform} platform={platform} />
              ))}
            </div>

            {post.status === "failed" && (
              <button
                type="button"
                onClick={() => onRetry(post.id)}
                disabled={isRetrying}
                className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-900 cursor-pointer transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <RotateCw
                  size={15}
                  className={isRetrying ? "animate-spin" : ""}
                  aria-hidden="true"
                />
                {isRetrying ? "Retrying..." : "Retry"}
              </button>
            )}
          </div>
        </div>
      </div>

      {post.status === "failed" && post.errorMessage && (
        <div
          role="note"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <span className="font-medium">Publishing error: </span>
          {post.errorMessage}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <time dateTime={post.scheduledAt}>
          {formattedDate} · {formattedTime}
        </time>

        <span>
          {post.platforms.length}{" "}
          {post.platforms.length === 1 ? "platform" : "platforms"}
        </span>
      </div>
    </article>
  );
}
