
import type { Platform } from "@/types/post";

const platformDetails: Record<
  Platform,
  { symbol: string; label: string; className: string }
> = {
  facebook: {
    symbol: "f",
    label: "Facebook",
    className: "bg-blue-100 text-blue-700",
  },
  instagram: {
    symbol: "◎",
    label: "Instagram",
    className: "bg-pink-100 text-pink-700",
  },
  x: {
    symbol: "𝕏",
    label: "X",
    className: "bg-gray-200 text-gray-900",
  },
  tiktok: {
    symbol: "♪",
    label: "TikTok",
    className: "bg-gray-900 text-white",
  },
};

interface PlatformIconProps {
  platform: Platform;
}

export default function PlatformIcon({
  platform,
}: PlatformIconProps) {
  const details = platformDetails[platform];

  return (
    <span
      role="img"
      aria-label={details.label}
      title={details.label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${details.className}`}
    >
      {details.symbol}
    </span>
  );
}
