export interface Video {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: Number;
  thumbnail: string;
  video: string;
  privacy: boolean;
  createdAt: Date;
  updatedAt: Date;
}
