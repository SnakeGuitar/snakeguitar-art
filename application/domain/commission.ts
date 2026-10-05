export type CommissionId = "headshot" | "halfBody" | "fullBody" | "poster" | "experimental" | "character";

type CommissionType = {
  id: CommissionId;
  price: number;
  modifier?: boolean;
  startingAt?: boolean;
};

export const commissionTypes: readonly CommissionType[] = [
  { id: "headshot", price: 15 },
  { id: "halfBody", price: 25 },
  { id: "fullBody", price: 40 },
  { id: "poster", price: 15, modifier: true },
  { id: "experimental", price: 5 },
  { id: "character", price: 130, startingAt: true },
];

export const socialLinks = [
  { id: "twitter", label: "Twitter / X", handle: "@SnakeGuitar", href: "https://x.com/SnakeGuitarr", icon: "𝕏" },
  { id: "vgen", label: "VGen", handle: "vgen.co/SnakeGuitar", href: "https://vgen.co/SnakeGuitar", icon: "V" },
  { id: "discord", label: "Discord", handle: "snakeguitar", href: null, icon: "D" },
] as const;

export type Artwork = {
  src: string;
  altKey: "portrait" | "character" | "poster" | "experimental";
  category: "sketch" | "poster" | "color";
  width: number;
  height: number;
};

export const artworks: Artwork[] = [
  { src: "/art/full-poster-1.webp", altKey: "poster", category: "poster", width: 1728, height: 2304 },
  { src: "/art/half-1.webp", altKey: "character", category: "sketch", width: 1602, height: 2400 },
  { src: "/art/experimental-color-1.webp", altKey: "experimental", category: "color", width: 1598, height: 2400 },
  { src: "/art/full-1.webp", altKey: "character", category: "sketch", width: 1349, height: 2400 },
  { src: "/art/full-3.webp", altKey: "character", category: "sketch", width: 1153, height: 2400 },
  { src: "/art/half-poster-2.webp", altKey: "poster", category: "poster", width: 1728, height: 2304 },
  { src: "/art/head-1.webp", altKey: "portrait", category: "sketch", width: 1080, height: 1350 },
  { src: "/art/half-3.webp", altKey: "character", category: "sketch", width: 1355, height: 2400 },
  { src: "/art/half-poster-1.webp", altKey: "poster", category: "poster", width: 1728, height: 2304 },
  { src: "/art/half-2.webp", altKey: "character", category: "sketch", width: 1600, height: 2400 },
  { src: "/art/half-4.webp", altKey: "character", category: "sketch", width: 1802, height: 2400 },
  { src: "/art/head-2.webp", altKey: "portrait", category: "sketch", width: 1080, height: 1350 },
  { src: "/art/head-3.webp", altKey: "portrait", category: "sketch", width: 2400, height: 2400 },
  { src: "/art/head-4.webp", altKey: "portrait", category: "sketch", width: 1802, height: 2400 },
  { src: "/art/full-2.webp", altKey: "character", category: "sketch", width: 975, height: 2400 },
];

export const calculateEstimate = (baseId: CommissionId, extras: CommissionId[]) => {
  const selected = commissionTypes.filter((item) => item.id === baseId || (extras.includes(item.id) && !(baseId === "character" && item.id === "poster")));
  return selected.reduce((total, item) => total + item.price, 0);
};
