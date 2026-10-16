import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  totalPosts: number;
  onCreatePost: () => void;
}

export default function DashboardHeader({
  onCreatePost,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          QueueUp
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
          Post Scheduler where you can plan and manage your social media content.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <button
          type="button"
          onClick={onCreatePost}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
          New post
        </button>
      </div>
    </header>
  );
}
