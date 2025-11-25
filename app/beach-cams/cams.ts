// app/beach-cams/cams.ts
export type CamProvider = "youtube" | "hls" | "iframe" | "external";

export type CamConfig = {
  id: string;
  title: string;
  town: string;
  market: "30A" | "PCB";
  provider: CamProvider;
  videoId?: string; // youtube
  hlsUrl?: string; // .m3u8
  iframeSrc?: string; // true embeddable iframe src
  poster?: string; // thumbnail (put images in /public/cams/*.jpg)
  externalHref?: string; // source page if not embeddable
  // booking/contract CTAs
  contract?: boolean;
  bookingHref?: string;
  bookingLabel?: string;
};

export const CAMS: CamConfig[] = [
  // ===== 30A (SoWal are external; YT embeds work) =====
  {
    id: "inlet-beach",
    title: "Inlet Beach Cam",
    town: "Inlet Beach",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/inlet-beachcam",
    poster: "/beach-cams/inlet-cam.jpg",
  },
  {
    id: "alys-beach",
    title: "Alys Beach Cam",
    town: "Alys Beach",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/alys-beachcam",
    poster: "/beach-cams/alys-cam.jpg",
  },
  {
    id: "seagrove",
    title: "Seagrove Beach SkyCam",
    town: "Seagrove Beach",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/seagrove-beach-skycam",
    poster: "/beach-cams/seagrove-cam.jpg",
  },
  {
    id: "seagrove-beach",
    title: "Seagrove Beach Cam",
    town: "Seagrove Beach",
    market: "30A",
    provider: "youtube",
    videoId: "3p1yMLhh9Jg",
    externalHref: "https://www.youtube.com/watch?v=3p1yMLhh9Jg",
  },
  {
    id: "seaside",
    title: "Seaside Beach Cam (Bud & Alley’s)",
    town: "Seaside",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/seaside-beachcam-bud-alleys",
    poster: "/beach-cams/seaside-cam.jpg",
  },
  {
    id: "watercolor",
    title: "WaterColor Beach Cam (East)",
    town: "WaterColor",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/watercolor-beachcam-east",
    poster: "/beach-cams/watercolor-cam.jpg",
  },
  {
    id: "grayton-beach",
    title: "Grayton Beach Cam",
    town: "Grayton Beach",
    market: "30A",
    provider: "external",
    externalHref: "https://sowal.com/webcam/grayton-beachcam",
    poster: "/beach-cams/grayton-cam.jpg",
  },

  // YouTube (embeddable)
  {
    id: "blue-mountain-beach",
    title: "Blue Mountain Beach Cam",
    town: "Blue Mountain Beach",
    market: "30A",
    provider: "youtube",
    videoId: "OiiLzGXq9_4",
    externalHref: "https://www.youtube.com/watch?v=OiiLzGXq9_4",
  },
  {
    id: "dune-allen",
    title: "Dune Allen Beach Cam",
    town: "Dune Allen",
    market: "30A",
    provider: "youtube",
    videoId: "xNZBPxx8ykg",
    externalHref: "https://www.youtube.com/watch?v=xNZBPxx8ykg",
  },

  // ===== PCB (most are external; add booking CTAs for contracted props) =====
  // Calypso Towers — contracted

  // Pineapple Willy's — 3 cams (treat as separate cards)
  {
    id: "pineapple-willys-pier",
    title: "Pineapple Willy’s — Pier Cam",
    town: "Pineapple Willy’s",
    market: "PCB",
    provider: "external",
    externalHref: "https://pwillys.com/beach-cam/",
    poster: "/beach-cams/pineapple-cam.jpg",
    contract: true,
    bookingHref: "/pcb/chairs?property=pineapple-willys",
    bookingLabel: "Book Chairs at PWilly’s",
  },
  // Sharky's (Seahaven)
  {
    id: "sharkys",
    title: "Sharky’s Beachfront Restaurant Cam",
    town: "Sharky’s / Seahaven",
    market: "PCB",
    provider: "external",
    externalHref: "https://seahavenbeach.com/panama-city/webcams/sharkys/",
    poster: "/beach-cams/sharkys-cam.jpg",
  },
  {
    id: "chateau-hotel",
    title: "Chateau Beachfront Hotel Cam",
    town: "Chateau (By The Sea)",
    market: "PCB",
    provider: "external",
    externalHref: "https://www.bythesearesorts.com/beach-cams",
    poster: "/beach-cams/chateau-cam.png",
    contract: true,
    bookingHref: "/pcb/chairs?property=chateau",
    bookingLabel: "Book Chairs at Chateau",
  },

  // Gulf Crest — contracted
  {
    id: "gulf-crest",
    title: "Gulf Crest Beach Cam",
    town: "Gulf Crest",
    market: "PCB",
    provider: "external",
    externalHref: "https://gulfcrestcondominiums.com/hdcam/",
    poster: "/beach-cams/gulf-crest-cam.jpg",
    contract: true,
    bookingHref: "/pcb/chairs?property=gulf-crest",
    bookingLabel: "Book Chairs at Gulf Crest",
  },

  // Embassy Suites — contracted
  {
    id: "embassy-suites",
    title: "Embassy Suites Beach Cam",
    town: "Embassy Suites",
    market: "PCB",
    provider: "external",
    externalHref:
      "https://www.earthcam.com/usa/florida/panamacity/?cam=panamacity",
    poster: "/beach-cams/embassy-cam.jpg",
    contract: true,
    bookingHref: "/pcb/chairs?property=embassy-suites",
    bookingLabel: "Book Chairs at Embassy",
  },
  {
    id: "calypso-towers",
    title: "Calypso Towers Beach Cam",
    town: "Calypso Towers",
    market: "PCB",
    provider: "external",
    externalHref: "https://www.calypsowebcam.com/",
    poster: "/beach-cams/calypso-cam.jpg",
    contract: true,
    bookingHref: "/pcb/chairs?property=calypso",
    bookingLabel: "Book Chairs at Calypso",
  },
];

// helper
export function getCam(id: string) {
  return CAMS.find((c) => c.id === id) ?? null;
}
