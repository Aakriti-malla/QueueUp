
"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import PostQueue from "@/components/PostQueue";
import { getPosts } from "@/lib/mock-api";
import type { Post } from "@/types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComposerNotice, setShowComposerNotice] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      setError("We couldn't load your posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          totalPosts={posts.length}
          onCreatePost={() => setShowComposerNotice(true)}
        />

        {showComposerNotice && (
          <div
            role="status"
            className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-800"
          >
            <p>
              The post composer is our next step. Your existing posts
              are safe.
            </p>

            <button
              type="button"
              onClick={() => setShowComposerNotice(false)}
              aria-label="Dismiss message"
              className="shrink-0 rounded p-1 font-semibold hover:bg-indigo-100"
            >
              ✕
            </button>
          </div>
        )}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Your queue
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All your posts, organized by scheduled date.
            </p>
          </div>

          {loading ? (
            <div
              role="status"
              aria-label="Loading posts"
              className="space-y-3"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
              <span className="sr-only">Loading posts...</span>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-white p-6 text-center"
            >
              <p className="font-medium text-gray-900">
                Unable to load posts
              </p>
              <p className="mt-2 text-sm text-gray-600">{error}</p>

              <button
                type="button"
                onClick={() => void loadPosts()}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Try again
              </button>
            </div>
          ) : (
            <PostQueue posts={posts} />
          )}
        </section>
      </div>
    </main>
  );
}
