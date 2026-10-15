
"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/mock-api";
import type { Post } from "@/types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError("Unable to load posts."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="p-8">Loading posts...</main>;
  if (error) return <main className="p-8">{error}</main>;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Mock Posts</h1>
      <p className="mb-6 text-gray-600">
        {posts.length} posts loaded successfully
      </p>

      <div className="space-y-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border p-4">
            <p>{post.content}</p>
            <p className="mt-2 text-sm text-gray-500">
              {post.platforms.join(", ")} · {post.status}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.scheduledAt).toLocaleString()}
            </p>
            {post.errorMessage && (
              <p className="mt-2 text-sm text-red-600">
                {post.errorMessage}
              </p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
