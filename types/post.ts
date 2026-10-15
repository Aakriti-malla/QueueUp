export type Platform =
  | "facebook"
  | "instagram"
  | "x"
  | "tiktok";

export type PostStatus =
  | "scheduled"
  | "published"
  | "failed";

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  mediaUrl?: string;
  scheduledAt: string; 
  status: PostStatus;
  errorMessage?: string;
}