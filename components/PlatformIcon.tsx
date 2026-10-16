import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiTiktok,
} from "@icons-pack/react-simple-icons";

import type { Platform } from "@/types/post";

const platformDetails = {
  facebook: {
    Icon: SiFacebook,
    label: "Facebook",
  },
  instagram: {
    Icon: SiInstagram,
    label: "Instagram",
  },
  x: {
    Icon: SiX,
    label: "X",
  },
  tiktok: {
    Icon: SiTiktok,
    label: "TikTok",
  },
} satisfies Record<
  Platform,
  {
    Icon: React.ComponentType<{
      size?: number;
      color?: string;
      title?: string;
    }>;
    label: string;
  }
>;

interface PlatformIconProps {
  platform: Platform;
  size?: number;
}

export default function PlatformIcon({
  platform,
  size = 18,
}: PlatformIconProps) {
  const { Icon, label } = platformDetails[platform];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-flex shrink-0 items-center justify-center text-gray-500"
    >
      <Icon size={size} color="currentColor" title={label} />
    </span>
  );
}
