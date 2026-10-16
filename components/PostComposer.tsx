
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import CharacterCounter, {
  CHARACTER_LIMITS,
} from "@/components/CharacterCounter";
import { createPost } from "@/lib/mock-api";
import type { Platform, Post } from "@/types/post";

interface PostComposerProps {
  onClose: () => void;
  onCreated: (post: Post) => void;
}

type ImagePreviewStatus = "idle" | "loading" | "loaded" | "error";

const platforms: { value: Platform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "tiktok", label: "TikTok" },
];

function formatDateTimeLocal(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDefaultDateTimeLocal(): string {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setSeconds(0, 0);

  return formatDateTimeLocal(date);
}

function getMinDateTimeLocal(): string {
  const date = new Date(Date.now() + 60_000);
  date.setSeconds(0, 0);

  return formatDateTimeLocal(date);
}

function getImageUrlError(value: string): string | null {
  if (!value) return null;

  if (/\s/.test(value)) {
    return "The image URL cannot contain spaces.";
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "Use an HTTP or HTTPS image URL.";
    }

    if (!url.hostname.includes(".")) {
      return "Enter a valid image URL with a domain name.";
    }
  } catch {
    return "Enter a valid image URL, such as https://example.com/image.jpg.";
  }

  return null;
}

export default function PostComposer({
  onClose,
  onCreated,
}: PostComposerProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "instagram",
  ]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState(getDefaultDateTimeLocal);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewStatus, setImagePreviewStatus] =
    useState<ImagePreviewStatus>("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
  isSubmittingRef.current = isSubmitting;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;

    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmittingRef.current) {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose, isSubmitting]);

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );

    setError("");
  }

  const characterCount = Array.from(content).length;

  const hasExceededLimit = selectedPlatforms.some(
    (platform) => characterCount > CHARACTER_LIMITS[platform]
  );

  const trimmedMediaUrl = mediaUrl.trim();
  const mediaUrlError = getImageUrlError(trimmedMediaUrl);
  const showImagePreview = Boolean(trimmedMediaUrl) && !mediaUrlError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please enter some post content.");
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError("Select at least one platform.");
      return;
    }

    if (hasExceededLimit) {
      setError(
        "Your content exceeds the character limit for a selected platform."
      );
      return;
    }

    if (trimmedMediaUrl) {
      if (mediaUrlError) {
        setError(mediaUrlError);
        return;
      }

      if (imagePreviewStatus === "error") {
        setError(
          "This image could not be loaded. Check the URL or choose another image."
        );
        return;
      }

      if (imagePreviewStatus !== "loaded") {
        setError("Wait for the image preview to load before scheduling.");
        return;
      }
    }

    if (!scheduledAt) {
      setError("Choose a scheduling time in the future.");
      return;
    }

    const localDate = new Date(scheduledAt);

    if (
      Number.isNaN(localDate.getTime()) ||
      localDate.getTime() <= Date.now()
    ) {
      setError("Choose a scheduling time in the future.");
      return;
    }

    setIsSubmitting(true);

    try {
      // datetime-local is local time; toISOString stores the time in UTC.
      const post = await createPost({
        content: content.trim(),
        platforms: [...selectedPlatforms],
        scheduledAt: localDate.toISOString(),
        ...(trimmedMediaUrl ? { mediaUrl: trimmedMediaUrl } : {}),
      });

      // Notify the parent only after the mock API succeeds.
      onCreated(post);
      onClose();
    } catch {
      // Keep all form state intact so the user can retry.
      setError("We couldn't create your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmittingRef.current
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        aria-describedby="composer-description"
        tabIndex={-1}
        className="max-h-[95dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-2xl sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="composer-title"
              className="text-xl font-bold text-gray-900"
            >
              Create a post
            </h2>

            <p
              id="composer-description"
              className="mt-1 text-sm text-gray-500"
            >
              Compose once and schedule across your platforms.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close composer"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="post-content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Post content
            </label>

            <textarea
              id="post-content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setError("");
              }}
              rows={5}
              placeholder="What would you like to share?"
              required
              className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selectedPlatforms.map((platform) => (
                <CharacterCounter
                  key={platform}
                  platform={platform}
                  content={content}
                />
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-gray-700">
              Publish to
            </legend>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {platforms.map((platform) => (
                <label
                  key={platform.value}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${
                    selectedPlatforms.includes(platform.value)
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.value)}
                    onChange={() => togglePlatform(platform.value)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  {platform.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="post-media"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Image URL{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <input
              id="post-media"
              type="url"
              inputMode="url"
              value={mediaUrl}
              onChange={(event) => {
                const value = event.target.value;

                setMediaUrl(value);
                setError("");
                setImagePreviewStatus(
                  value.trim() ? "loading" : "idle"
                );
              }}
              placeholder="https://example.com/image.jpg"
              aria-invalid={Boolean(mediaUrlError) || imagePreviewStatus === "error"}
              aria-describedby={
                mediaUrlError || imagePreviewStatus === "error"
                  ? "post-media-error"
                  : "post-media-help"
              }
              className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p id="post-media-help" className="mt-2 text-xs text-gray-500">
              Use a direct image URL. The preview must load before scheduling.
            </p>

            {mediaUrlError && (
              <p
                id="post-media-error"
                role="alert"
                className="mt-2 text-sm text-red-600"
              >
                {mediaUrlError}
              </p>
            )}

            {showImagePreview && imagePreviewStatus === "loading" && (
              <p role="status" className="mt-3 text-sm text-gray-500">
                Loading image preview...
              </p>
            )}

            {showImagePreview && imagePreviewStatus === "error" && (
              <p
                id="post-media-error"
                role="alert"
                className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                This image could not be loaded. Check that the URL points to
                an accessible image and try again.
              </p>
            )}

            {showImagePreview && imagePreviewStatus !== "error" && (
              <img
                src={trimmedMediaUrl}
                alt="Post media preview"
                referrerPolicy="no-referrer"
                onLoad={() => setImagePreviewStatus("loaded")}
                onError={() => setImagePreviewStatus("error")}
                className={`mt-3 max-h-48 max-w-full rounded-lg border border-gray-200 object-contain ${
                  imagePreviewStatus === "loading" ? "hidden" : ""
                }`}
              />
            )}
          </div>

          <div>
            <label
              htmlFor="post-schedule"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Schedule date and time
            </label>

            <input
              id="post-schedule"
              type="datetime-local"
              value={scheduledAt}
              min={getMinDateTimeLocal()}
              onChange={(event) => {
                setScheduledAt(event.target.value);
                setError("");
              }}
              required
              className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Time is entered in your local timezone and stored in UTC.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-11 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !content.trim() ||
                selectedPlatforms.length === 0 ||
                hasExceededLimit
              }
              className="min-h-11 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Scheduling..." : "Schedule post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
