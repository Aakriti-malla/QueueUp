
"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { filterPosts } from "@/lib/post-utils";
import type { Platform, Post, PostStatus } from "@/types/post";
import PostQueue from "@/components/PostQueue";

interface PostFiltersProps {
  posts: Post[];
}

const platforms: { value: Platform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "tiktok", label: "TikTok" },
];

const statuses: { value: PostStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "failed", label: "Failed" },
];

const validPlatforms: Platform[] = [
  "facebook",
  "instagram",
  "x",
  "tiktok",
];

const validStatuses: PostStatus[] = [
  "scheduled",
  "published",
  "failed",
];

export default function PostFilters({ posts }: PostFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPlatforms = (searchParams.get("platform") ?? "")
    .split(",")
    .filter((value): value is Platform =>
      validPlatforms.includes(value as Platform)
    );

  const rawStatus = searchParams.get("status") ?? "";
  const selectedStatus = validStatuses.includes(rawStatus as PostStatus)
    ? (rawStatus as PostStatus)
    : "";

  const search = searchParams.get("search") ?? "";

  function updateQuery(
    key: string,
    value: string | null
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function togglePlatform(platform: Platform) {
    const nextPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((item) => item !== platform)
      : [...selectedPlatforms, platform];

    updateQuery(
      "platform",
      nextPlatforms.length > 0 ? nextPlatforms.join(",") : null
    );
  }

  const filteredPosts = filterPosts(posts, {
    platforms: selectedPlatforms,
    status: selectedStatus,
    search,
  });

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("platform");
    params.delete("status");
    params.delete("search");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const hasFilters =
    selectedPlatforms.length > 0 || Boolean(selectedStatus) || Boolean(search);

  return (
    <div className="space-y-6">
      <section
        aria-label="Filter posts"
        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="post-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search posts
            </label>
            <input
              id="post-search"
              type="search"
              value={search}
              onChange={(event) =>
                updateQuery("search", event.target.value || null)
              }
              placeholder="Search post content..."
              className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-blue-900"
            />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-gray-700">
              Platforms
            </legend>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {platforms.map((platform) => (
                <label
                  key={platform.value}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.value)}
                    onChange={() => togglePlatform(platform.value)}
                    className="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  {platform.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="post-status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="post-status"
              value={selectedStatus}
              onChange={(event) => updateQuery("status", event.target.value || null)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p aria-live="polite" className="text-sm text-gray-500">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-10 rounded-lg px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      <PostQueue posts={filteredPosts} />
    </div>
  );
}
