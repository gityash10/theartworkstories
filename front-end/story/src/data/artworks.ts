export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
}

export const availableArtworks: Artwork[] = [
  {
    id: "cafe-terrace",
    title: "Café Terrace at Night",
    artist: "Vincent van Gogh",
    image: "/assets/images/artworks/cafe-terrace.jpg",
  },
  {
    id: "great-wave",
    title: "The Great Wave",
    artist: "Katsushika Hokusai",
    image: "/assets/images/artworks/great-wave.jpg",
  },
  {
    id: "winged-victory",
    title: "Winged Victory",
    artist: "Ancient Greece",
    image: "/assets/images/artworks/winged-victory.jpg",
  },
  {
    id: "himalayan-dawn",
    title: "Himalayan Dawn",
    artist: "Community Artist",
    image: "/assets/images/artworks/sample1-bg.png",
  },
  {
    id: "flowers",
    title: "Flowers",
    artist: "Community Artist",
    image: "/assets/images/artworks/sunflower-field.png",
  },
  {
    id: "building",
    title: "The Building",
    artist: "Community Artist",
    image: "/assets/images/artworks/sample 1.jpg",
  },
  {
    id: "fragments",
    title: "Fragments",
    artist: "Community Artist",
    image: "/assets/images/artworks/surreal-hand.png",
  },
  {
    id: "vessel",
    title: "Vessel",
    artist: "Community Artist",
    image: "/assets/images/artworks/the-thinker.png",
  },
  {
    id: "mountains",
    title: "Mountains",
    artist: "Community Artist",
    image: "/assets/images/artworks/starry-night.png",
  },
];
