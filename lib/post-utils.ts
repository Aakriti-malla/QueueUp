import type { Platform, Post, PostStatus } from "@/types/post";

export interface PostFilters {
  platforms: Platform[];
  status: PostStatus | "";
  search: string;
}

export function filterPosts(
  posts: Post[],
  filters: PostFilters
): Post[] {
  const search = filters.search.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesPlatform =
      filters.platforms.length === 0 ||
      filters.platforms.some((platform) =>
        post.platforms.includes(platform)
      );

    const matchesStatus =
      !filters.status || post.status === filters.status;

    const matchesSearch =
      !search || post.content.toLowerCase().includes(search);

    return matchesPlatform && matchesStatus && matchesSearch;
  });
}

export function groupPostsByDay(
  posts: Post[],
  now = new Date()
): { title: string; dateKey: string; posts: Post[] }[] {
  const groups = new Map<string, Post[]>();

  for (const post of posts) {
    const date = new Date(post.scheduledAt);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const existing = groups.get(dateKey) ?? [];
    existing.push(post);
    groups.set(dateKey, existing);
  }

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return Array.from(groups.entries())
    .map(([dateKey, groupedPosts]) => {
      groupedPosts.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime()
      );

      const firstPostDate = new Date(groupedPosts[0].scheduledAt);
      const day = new Date(firstPostDate);
      day.setHours(0, 0, 0, 0);

      let title: string;

      if (day.getTime() === today.getTime()) {
        title = "Today";
      } else if (day.getTime() === tomorrow.getTime()) {
        title = "Tomorrow";
      } else {
        title = firstPostDate.toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      return { title, dateKey, posts: groupedPosts };
    })
    .sort((a, b) => {
      const dateA = new Date(a.posts[0].scheduledAt).getTime();
      const dateB = new Date(b.posts[0].scheduledAt).getTime();
      return dateA - dateB;
    });
}
