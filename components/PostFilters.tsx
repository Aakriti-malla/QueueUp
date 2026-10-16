"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { filterPosts } from "@/lib/post-utils";
import type { Platform, Post, PostStatus } from "@/types/post";
import PostQueue from "@/components/PostQueue";
import PlatformIcon from "@/components/PlatformIcon";

interface PostFiltersProps {
  posts: Post[];
  onRetry: (id: string) => void;
  retryingPostIds: string[];
}

const platforms: { value: Platform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "tiktok", label: "TikTok" },
];

const statuses: { value: PostStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "failed", label: "Failed" },
];

const validPlatforms: Platform[] = ["facebook", "instagram", "x", "tiktok"];

const validStatuses: PostStatus[] = ["scheduled", "published", "failed"];

export default function PostFilters({
  posts,
  onRetry,
  retryingPostIds,
}: PostFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);

  const selectedPlatforms = (searchParams.get("platform") ?? "")
    .split(",")
    .filter((value): value is Platform =>
      validPlatforms.includes(value as Platform),
    );

  const rawStatus = searchParams.get("status") ?? "";
  const selectedStatus = validStatuses.includes(rawStatus as PostStatus)
    ? (rawStatus as PostStatus)
    : "";

  const search = searchParams.get("search") ?? "";

  const selectedStatusLabel =
    statuses.find((status) => status.value === selectedStatus)?.label ?? "All";

  function updateQuery(key: string, value: string | null) {
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
      nextPlatforms.length > 0 ? nextPlatforms.join(",") : null,
    );
  }

  function selectStatus(status: PostStatus | "") {
    updateQuery("status", status || null);
    setIsStatusOpen(false);
    statusButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!isStatusOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsStatusOpen(false);
        statusButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStatusOpen]);

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
      <section aria-label="Filter posts" className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <label htmlFor="post-search" className="sr-only">
            Search posts
          </label>

          <input
            id="post-search"
            type="search"
            value={search}
            onChange={(event) =>
              updateQuery("search", event.target.value || null)
            }
            placeholder="Search posts"
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Platform pills and status dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            Platforms
          </span>

          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.value);

            return (
              <label
                key={platform.value}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-medium ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePlatform(platform.value)}
                  className="sr-only"
                />

                <PlatformIcon platform={platform.value} size={20} />
                {platform.label}
              </label>
            );
          })}

          <div ref={statusMenuRef} className="relative ml-0 sm:ml-1">
            <button
              ref={statusButtonRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isStatusOpen}
              onClick={() => setIsStatusOpen((open) => !open)}
              className={`inline-flex min-h-11 items-center gap-2.5 rounded-xl border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                selectedStatus
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={19} aria-hidden="true" />
              <span>Status: {selectedStatusLabel}</span>
              <ChevronDown
                size={17}
                aria-hidden="true"
                className={`transition-transform ${
                  isStatusOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isStatusOpen && (
              <div
                role="listbox"
                aria-label="Filter by post status"
                aria-activedescendant={`status-option-${selectedStatus || "all"}`}
                className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
              >
                <p className="px-3 pb-2 pt-2 text-sm font-semibold text-gray-900">
                  Post status
                </p>

                {statuses.map((status) => {
                  const isSelected = selectedStatus === status.value;
                  const optionId = `status-option-${status.value || "all"}`;

                  return (
                    <button
                      key={status.value}
                      id={optionId}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectStatus(status.value)}
                      className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
                    >
                      <span>{status.label}</span>

                      {isSelected && (
                        <Check
                          size={17}
                          aria-hidden="true"
                          className="text-indigo-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p aria-live="polite" className="text-sm text-gray-500">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
        </div>
      </section>

      <PostQueue
        posts={filteredPosts}
        onRetry={onRetry}
        retryingPostIds={retryingPostIds}
      />
    </div>
  );
}
