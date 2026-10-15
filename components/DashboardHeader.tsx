
interface DashboardHeaderProps {
  totalPosts: number;
  onCreatePost: () => void;
}

export default function DashboardHeader({
  totalPosts,
  onCreatePost,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-indigo-600">
          CONTENT WORKSPACE
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Post scheduler
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Plan and manage your social media content.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {totalPosts} posts
        </span>

        <button
          type="button"
          onClick={onCreatePost}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span aria-hidden="true">+</span>
          Create post
        </button>
      </div>
    </header>
  );
}
