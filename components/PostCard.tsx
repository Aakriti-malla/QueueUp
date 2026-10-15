
import type { Post, PostStatus } from "@/types/post";
import PlatformIcon from "@/components/PlatformIcon";

interface PostCardProps {
  post: Post;
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

export default function PostCard({ post }: PostCardProps) {
  const status = statusDetails[post.status];

  const scheduledDate = new Date(post.scheduledAt);
  console.log(scheduledDate)
  const formattedTime = scheduledDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });


  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="flex -space-x-1">
            {post.platforms.map((platform) => (
              <PlatformIcon
                key={platform}
                platform={platform}
              />
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6 text-gray-800">
              {post.content}
            </p>

            {post.mediaUrl && (
              <a
                href={post.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
              >
                View attached media
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <time dateTime={post.scheduledAt}>
          {formattedDate} · {formattedTime}
        </time>

        <span>
          {post.platforms.length}{" "}
          {post.platforms.length === 1 ? "platform" : "platforms"}
        </span>
      </div>

      {post.status === "failed" && post.errorMessage && (
        <div
          role="note"
          className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <span className="font-semibold">Publishing error: </span>
          {post.errorMessage}
        </div>
      )}
    </article>
  );
}
