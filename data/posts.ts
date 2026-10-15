
import type { Platform, Post, PostStatus } from "@/types/post";

interface MockPostInput {
  id: string;
  content: string;
  platforms: Platform[];
  daysFromNow: number;
  hour: number;
  status: PostStatus;
  mediaUrl?: string;
  errorMessage?: string;
}


function createTimestamp(daysFromNow: number, hour: number): string {
  const now = new Date();
  const date = new Date(now);

  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);

  if (daysFromNow === 0 && date.getTime() <= now.getTime()) {
    date.setTime(
      now.getTime() + (15 + (hour % 3) * 15) * 60_000
    );
  }

  return date.toISOString();
}


const mockPostInputs: MockPostInput[] = [
  {
    id: "post-01",
    content: "Introducing our new product lineup. What are you most excited about?",
    platforms: ["instagram", "facebook"],
    daysFromNow: 0,
    hour: 18,
    status: "scheduled",
    mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  },
  {
    id: "post-02",
    content: "Three things we learned while building our latest feature.",
    platforms: ["x"],
    daysFromNow: 0,
    hour: 20,
    status: "scheduled",
  },
  {
    id: "post-03",
    content: "A little behind-the-scenes look at our creative process.",
    platforms: ["tiktok", "instagram"],
    daysFromNow: 0,
    hour: 21,
    status: "scheduled",
  },
  {
    id: "post-04",
    content: "Our weekend collection is here. Explore the full range today!",
    platforms: ["facebook"],
    daysFromNow: -2,
    hour: 10,
    status: "published",
  },
  {
    id: "post-05",
    content: "We couldn't publish this campaign because the media upload failed.",
    platforms: ["instagram"],
    daysFromNow: -1,
    hour: 12,
    status: "failed",
    errorMessage: "Media upload failed. Please retry.",
  },
  {
    id: "post-06",
    content: "Quick tips to make your workspace more productive.",
    platforms: ["x", "facebook"],
    daysFromNow: 1,
    hour: 9,
    status: "scheduled",
  },
  {
    id: "post-07",
    content: "Your reminder to take a break and recharge.",
    platforms: ["instagram"],
    daysFromNow: 1,
    hour: 11,
    status: "scheduled",
  },
  {
    id: "post-08",
    content: "Five books that changed how we think about creativity.",
    platforms: ["facebook", "instagram"],
    daysFromNow: 1,
    hour: 14,
    status: "scheduled",
  },
  {
    id: "post-09",
    content: "POV: You finally find the perfect morning routine.",
    platforms: ["tiktok"],
    daysFromNow: 1,
    hour: 17,
    status: "scheduled",
  },
  {
    id: "post-10",
    content: "Small steps, consistent progress. That's the whole secret.",
    platforms: ["x"],
    daysFromNow: 2,
    hour: 10,
    status: "scheduled",
  },
  {
    id: "post-11",
    content: "Meet the people behind our latest release.",
    platforms: ["facebook", "instagram"],
    daysFromNow: 2,
    hour: 13,
    status: "scheduled",
  },
  {
    id: "post-12",
    content: "A quick tutorial you can save and revisit later.",
    platforms: ["tiktok", "instagram"],
    daysFromNow: 2,
    hour: 19,
    status: "scheduled",
  },
  {
    id: "post-13",
    content: "Our most-loved features, ranked by the community.",
    platforms: ["x", "facebook"],
    daysFromNow: 3,
    hour: 11,
    status: "scheduled",
  },
  {
    id: "post-14",
    content: "Behind every great idea is a curious mind.",
    platforms: ["instagram"],
    daysFromNow: 3,
    hour: 16,
    status: "scheduled",
  },
  {
    id: "post-15",
    content: "This is your sign to start that project you've been postponing.",
    platforms: ["tiktok"],
    daysFromNow: 3,
    hour: 18,
    status: "scheduled",
  },
  {
    id: "post-16",
    content: "Thank you for being part of our journey so far!",
    platforms: ["facebook", "x"],
    daysFromNow: -4,
    hour: 15,
    status: "published",
  },
  {
    id: "post-17",
    content: "A fresh perspective can change everything.",
    platforms: ["instagram"],
    daysFromNow: -3,
    hour: 12,
    status: "published",
  },
  {
    id: "post-18",
    content: "The launch announcement failed to publish due to a temporary API error.",
    platforms: ["x"],
    daysFromNow: -2,
    hour: 16,
    status: "failed",
    errorMessage: "Temporary publishing error. Please retry.",
  },
  {
    id: "post-19",
    content: "A closer look at the details that make a difference.",
    platforms: ["instagram", "facebook"],
    daysFromNow: 4,
    hour: 10,
    status: "scheduled",
  },
  {
    id: "post-20",
    content: "What is one skill you want to learn this month?",
    platforms: ["x"],
    daysFromNow: 4,
    hour: 14,
    status: "scheduled",
  },
  {
    id: "post-21",
    content: "A day in the life of our design team.",
    platforms: ["tiktok", "instagram"],
    daysFromNow: 5,
    hour: 12,
    status: "scheduled",
  },
  {
    id: "post-22",
    content: "Our latest community highlights are here.",
    platforms: ["facebook"],
    daysFromNow: 5,
    hour: 17,
    status: "scheduled",
  },
  {
    id: "post-23",
    content: "One useful shortcut that saves us time every day.",
    platforms: ["x", "instagram"],
    daysFromNow: 6,
    hour: 9,
    status: "scheduled",
  },
  {
    id: "post-24",
    content: "The little details behind our newest campaign.",
    platforms: ["facebook", "instagram"],
    daysFromNow: 6,
    hour: 15,
    status: "scheduled",
  },
  {
    id: "post-25",
    content: "Try this simple creative challenge with us.",
    platforms: ["tiktok"],
    daysFromNow: 7,
    hour: 18,
    status: "scheduled",
  },
  {
    id: "post-26",
    content: "A few lessons we learned from our community.",
    platforms: ["facebook", "x"],
    daysFromNow: -5,
    hour: 11,
    status: "published",
  },
  {
    id: "post-27",
    content: "A new week, a new opportunity to make something great.",
    platforms: ["instagram"],
    daysFromNow: 8,
    hour: 10,
    status: "scheduled",
  },
  {
    id: "post-28",
    content: "Save this checklist before your next big project.",
    platforms: ["tiktok", "facebook"],
    daysFromNow: 8,
    hour: 16,
    status: "scheduled",
  },
  {
    id: "post-29",
    content: "Tell us what you would like to see from us next.",
    platforms: ["x", "instagram"],
    daysFromNow: 9,
    hour: 13,
    status: "scheduled",
  },
  {
    id: "post-30",
    content: "A recap of our favorite moments from this month.",
    platforms: ["facebook", "instagram", "tiktok"],
    daysFromNow: 10,
    hour: 18,
    status: "scheduled",
    mediaUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
  },
];

export const initialPosts: Post[] = mockPostInputs.map((post) => ({
  ...post,
  scheduledAt: createTimestamp(post.daysFromNow, post.hour),
}));
