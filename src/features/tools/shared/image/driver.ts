import type { ImageFormat } from "./types"
import type { CompressInput } from "./compressor"
import { imageElementToCanvas, cropCanvas, rotateCanvas } from "./driverOps"
import { extractJpegExif, detectFormat } from "./metadata"

/**
 * IMPURE MODULE — the only place in the shared engine that touches browser
 * canvas APIs (decode, ImageBitmap, rendering, Blob encoding).
 *
 * Every other module stays renderer-agnostic. Components communicate with the
 * engine only through this driver's exported functions.
 */

export interface DecodedImage {
  bitmapCarrier: CanvasImageSource
  sourceWidth: number
  sourceHeight: number
  /** EXIF orientation value detected (may be auto-normalized during decode). */
  orientation?: number
  format?: ImageFormat
}

export interface DriverRender {
  toCanvas: (target?: { width?: number; height?: number }) => HTMLCanvasElement
  encodeJpeg: (quality: number) => Promise<Blob>
  encodePng: () => Promise<Blob>
  asCompressInput: (width: number, height: number) => CompressInput
}

/**
 * Decode a File into an ImageBitmap, applying EXIF orientation automatically
 * via `imageOrientation:"from-image"` (smartphone images appear upright).
 */
export async function decodeImage(source: File | Blob): Promise<DecodedImage> {
  const data = new Uint8Array(await source.arrayBuffer())
  const format = detectFormat(data)

  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" })
  const exif = extractJpegExif(data)

  return {
    bitmapCarrier: bitmap,
    sourceWidth: bitmap.width,
    sourceHeight: bitmap.height,
    orientation: exif.orientation,
    format,
  }
}

/** Render a decoded image to a canvas at (width,height). */
export function renderToCanvas(
  image: DecodedImage,
  width: number,
  height: number,
): HTMLCanvasElement {
  return imageElementToCanvas(image.bitmapCarrier, width, height)
}

/** Build impure encode handles for a decoded image drawing a given AR. */
export function makeRenderHandle(
  source: DecodedImage,
  width: number,
  height: number,
): DriverRender {
  const render = () => renderToCanvas(source, width, height)
  return {
    toCanvas: () => render(),
    encodeJpeg: (quality) => canvasToBlob(render(), "image/jpeg", quality),
    encodePng: () => canvasToBlob(render(), "image/png"),
    asCompressInput: (w, h) => ({
      encodeJpeg: (quality) => canvasToBlob(renderToCanvas(source, w, h), "image/jpeg", quality),
      encodePng: () => canvasToBlob(renderToCanvas(source, w, h), "image/png"),
      width: w,
      height: h,
    }),
  }
}

/** Encode a canvas to a Blob. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error(`Encoding to ${type} failed.`))),
      type,
      quality,
    )
  })
}

export { imageElementToCanvas, cropCanvas, rotateCanvas }