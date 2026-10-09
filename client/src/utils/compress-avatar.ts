/**
 * The API rejects avatars larger than 300 KB, so anything a user picks is
 * squeezed down to fit before it is uploaded.
 */
const MAX_AVATAR_BYTES = 300 * 1024;

/**
 * Multipart encoding wraps the file in a few hundred bytes of headers and
 * boundaries, so aim just under the ceiling rather than at it.
 */
const TARGET_BYTES = Math.floor(MAX_AVATAR_BYTES * 0.95);

/** Avatars render at 144px, so 512 keeps them sharp on a retina screen. */
const MAX_DIMENSION = 512;

/** Tried in order; the first size that fits wins. */
const QUALITY_STEPS = [0.92, 0.8, 0.7, 0.6, 0.5];

/** WebP first, because it keeps transparency and compresses well. */
const OUTPUT_TYPES = ["image/webp", "image/jpeg"];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error("That file is not an image we can read.")
      );
    };

    image.src = url;
  });

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  return canvas;
};

const toBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });

const renameTo = (name: string, type: string) => {
  const base = name.replace(/\.[^.]+$/, "") || "avatar";

  return `${base}.${type === "image/webp" ? "webp" : "jpg"}`;
};

/**
 * Shrinks an image to fit the 300 KB avatar limit.
 *
 * The picture is scaled to at most {@link MAX_DIMENSION} on its longest edge
 * and re-encoded, stepping the quality down and halving the size each round
 * until it fits. Images that already fit are returned untouched, so picking a
 * small picture does not cost it a pointless round of re-encoding.
 */
export const compressAvatar = async (file: File): Promise<File> => {
  const image = await loadImage(file);

  const longestEdge = Math.max(image.width, image.height);

  if (file.size <= TARGET_BYTES && longestEdge <= MAX_DIMENSION) {
    return file;
  }

  let maxDimension = MAX_DIMENSION;

  // Four halvings take a 4000px photo down to 250px, which is far further
  // than any real picture needs to reach the limit.
  for (let round = 0; round < 4; round += 1) {
    const scale = Math.min(1, maxDimension / longestEdge);

    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    if (!context) break;

    context.drawImage(image, 0, 0, width, height);

    // JPEG has no alpha channel, so it needs something to composite onto -
    // without this, transparent pixels would come out black.
    const opaqueCanvas = createCanvas(width, height);
    const opaqueContext = opaqueCanvas.getContext("2d");

    if (opaqueContext) {
      opaqueContext.fillStyle = "#ffffff";
      opaqueContext.fillRect(0, 0, width, height);
      opaqueContext.drawImage(canvas, 0, 0);
    }

    for (const type of OUTPUT_TYPES) {
      const source =
        type === "image/jpeg" && opaqueContext
          ? opaqueCanvas
          : canvas;

      for (const quality of QUALITY_STEPS) {
        const blob = await toBlob(source, type, quality);

        // A browser that cannot encode the format silently hands back a PNG
        // instead, so stop trying qualities and move to the next format.
        if (!blob || blob.type !== type) break;

        if (blob.size <= TARGET_BYTES) {
          return new File([blob], renameTo(file.name, type), {
            type,
            lastModified: file.lastModified,
          });
        }
      }
    }

    maxDimension = Math.round(maxDimension / 2);
  }

  throw new Error(
    "We could not shrink that image enough. Please try a different one."
  );
};
