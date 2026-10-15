
import { initialPosts } from "@/data/posts";
import type { Post } from "@/types/post";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/* This array represents our in-memory backend. */
let posts: Post[] = initialPosts.map((post) => ({
  ...post,
  platforms: [...post.platforms],
}));

function clonePosts(data: Post[]): Post[] {
  return data.map((post) => ({
    ...post,
    platforms: [...post.platforms],
  }));
}

/* Simulating loading posts from an API.*/
export async function getPosts(): Promise<Post[]> {
  await delay(500);

  return clonePosts(posts);
}

/* Adding a new scheduled post. */
export async function createPost(
  input: Omit<Post, "id" | "status" | "errorMessage">
): Promise<Post> {
  await delay(400);

  const newPost: Post = {
    ...input,
    id: crypto.randomUUID(),
    status: "scheduled",
  };

  posts = [newPost, ...posts];

  return { ...newPost, platforms: [...newPost.platforms] };
}

/* Retry a failed post. The request takes one second. */
export async function retryPost(id: string): Promise<Post> {
  await delay(1000);

  const post = posts.find((item) => item.id === id);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.status !== "failed") {
    throw new Error("Only failed posts can be retried.");
  }

  /* Simulating 20% request failure rate. */
  if (Math.random() < 0.2) {
    throw new Error("Retry failed due to a temporary API error.");
  }

  const updatedPost: Post = {
    ...post,
    status: "scheduled",
    errorMessage: undefined,
  };

  posts = posts.map((item) =>
    item.id === id ? updatedPost : item
  );

  return {
    ...updatedPost,
    platforms: [...updatedPost.platforms],
  };
}
