export interface Channel {
  id: string;
  number: number;
  name: string;
  category: string;
  iconName: string; // Used to pick an icon from lucide-react dynamically or just a generic icon
  color: string;
}

export interface Program {
  id: string;
  channelId: string;
  videoId: string;
  title: string;
  durationSeconds: number; // exact length of the youtube video
  startTime: number; // Unix timestamp
  endTime: number;   // Unix timestamp
}

export interface VideoAsset {
  videoId: string;
  title: string;
  durationSeconds: number;
}
