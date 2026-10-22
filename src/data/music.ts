export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  mood: string;
  src: string;
};

export const playlist: MusicTrack[] = [
  {
    id: "valley-sunset",
    title: "Valley Sunset",
    artist: "Alejandro Magaña",
    mood: "Ambient",
    src: "/music/mixkit-valley-sunset-127.mp3",
  },
  {
    id: "digital-clouds",
    title: "Digital Clouds",
    artist: "Alejandro Magaña",
    mood: "Futuristic",
    src: "/music/mixkit-digital-clouds-175.mp3",
  },
  {
    id: "vastness",
    title: "Vastness",
    artist: "Andrew Ev",
    mood: "Cinematic",
    src: "/music/mixkit-vastness-184.mp3",
  },
  {
    id: "hazy-after-hours",
    title: "Hazy After Hours",
    artist: "Alejandro Magaña",
    mood: "Electronica",
    src: "/music/mixkit-hazy-after-hours-132.mp3",
  },
  {
    id: "spirit-in-the-woods",
    title: "Spirit in the Woods",
    artist: "Alejandro Magaña",
    mood: "Ambient",
    src: "/music/mixkit-spirit-in-the-woods-2-147.mp3",
  },
];
