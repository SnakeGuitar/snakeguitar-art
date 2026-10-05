import { readdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

const audioExtensions = new Set([".mp3", ".ogg", ".wav", ".m4a", ".aac", ".flac"]);

export async function GET() {
  const musicDirectory = path.join(process.cwd(), "public", "music");

  try {
    const files = await readdir(musicDirectory);
    const tracks = files
      .filter((file) => audioExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => {
        const baseName = path.basename(file, path.extname(file));
        const [artist, ...titleParts] = baseName.split(/\s+(?:—|–|-)\s+/);
        const hasArtist = titleParts.length > 0;

        return {
          title: (hasArtist ? titleParts.join(" - ") : baseName).replace(/[_]+/g, " "),
          artist: hasArtist ? artist.replace(/[_]+/g, " ") : undefined,
          src: `/music/${encodeURIComponent(file)}`,
        };
      });

    return Response.json(tracks);
  } catch {
    return Response.json([]);
  }
}
