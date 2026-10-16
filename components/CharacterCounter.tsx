
import type { Platform } from "@/types/post";

export const CHARACTER_LIMITS: Record<Platform, number> = {
  x: 280,
  instagram: 2200,
  tiktok: 2200,
  facebook: 5000,
};

const platformLabels: Record<Platform, string> = {
  x: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

interface CharacterCounterProps {
  platform: Platform;
  content: string;
}

export default function CharacterCounter({
  platform,
  content,
}: CharacterCounterProps) {
  const count = Array.from(content).length;
  const limit = CHARACTER_LIMITS[platform];
  const isOverLimit = count > limit;

  return (
    <p
      className={`text-xs ${
        isOverLimit ? "font-medium text-red-600" : "text-gray-500"
      }`}
      aria-live="polite"
    >
      {platformLabels[platform]}: {count}/{limit}
      {isOverLimit && " — Character limit exceeded"}
    </p>
  );
}
