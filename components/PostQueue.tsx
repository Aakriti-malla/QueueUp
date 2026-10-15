
import type { Post } from "@/types/post";
import { groupPostsByDay } from "@/lib/post-utils";
import PostCard from "@/components/PostCard";

interface PostQueueProps {
  posts: Post[];
}

export default function PostQueue({ posts }: PostQueueProps) {
  const groups = groupPostsByDay(posts);

  if (posts.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="text-base font-semibold text-gray-900">
          No posts to show
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Your posts will appear here once they are available.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section
          key={group.dateKey}
          aria-labelledby={`group-${group.dateKey}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              id={`group-${group.dateKey}`}
              className="text-sm font-semibold text-gray-900"
            >
              {group.title}
            </h2>

            <span className="text-xs text-gray-500">
              {group.posts.length}{" "}
              {group.posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          <div className="space-y-3">
            {group.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
