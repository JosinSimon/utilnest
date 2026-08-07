import { describe, it, expect } from "vitest"
import {
  cmToPx,
  pxToCm,
  inchToPx,
  pxToInch,
  dimensionsToPixels,
  aspectRatio,
  fitRect,
  coverRect,
  clampCrop,
  orientationToTransform,
  orientedSize,
  fitScale,
} from "./geometry"

describe("geometry cm<->px", () => {
  it("converts cm to px using (cm/2.54)*dpi", () => {
    expect(cmToPx(2.54, 100)).toBe(100)
    expect(cmToPx(3.5, 300)).toBe(Math.round((3.5 / 2.54) * 300))
  })

  it("converts px to cm", () => {
    expect(pxToCm(72, 72)).toBeCloseTo(2.54)
  })

  it("does not assume 96 dpi", () => {
    // At 300 dpi, 1 inch = 300 px
    expect(inchToPx(1, 300)).toBe(300)
    expect(pxToInch(300, 300)).toBe(1)
  })

  it("resolves dimensions in cm to px at a given dpi", () => {
    expect(dimensionsToPixels({ width: 3.5, height: 4.5, unit: "cm" }, 300)).toEqual({
      width: Math.round((3.5 / 2.54) * 300),
      height: Math.round((4.5 / 2.54) * 300),
    })
  })
})

describe("geometry aspect ratio", () => {
  it("reduces to a canonical pair", () => {
    expect(aspectRatio(200, 200)).toEqual({ width: 1, height: 1 })
    expect(aspectRatio(200, 230)).toEqual({ width: 20, height: 23 })
  })

  it("fitRect letterboxes preserving aspect", () => {
    // 100x50 into 50x50 -> scaled to 50x25 centered
    const r = fitRect(100, 50, 50, 50)
    expect(r.width).toBe(50)
    expect(r.height).toBe(25)
    expect(Math.abs(r.y * 2 + 25 - 50)).toBeLessThanOrEqual(1)
  })

  it("coverRect scales up to fill the box preserving aspect", () => {
    const r = coverRect(200, 100, 100, 100)
    // scale = max(100/200,100/100)=1 -> width 200, height 100
    expect(r.width).toBe(200)
    expect(r.height).toBe(100)
  })

  it("clampCrop stays in bounds", () => {
    expect(clampCrop({ x: -5, y: 0, width: 10, height: 10 }, 50, 50)).toEqual({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    })
  })

  it("fitScale", () => {
    expect(fitScale(100, 50, 50, 50)).toBe(0.5)
  })
})

describe("geometry EXIF orientation", () => {
  it("orientation 1 is identity", () => {
    expect(orientationToTransform(1)).toEqual({ rotate: 0, flipX: false, swapWidthHeight: false })
  })

  it("orientation 6 rotates 90 and swaps dims", () => {
    const tx = orientationToTransform(6)!
    expect(tx.rotate).toBe(90)
    expect(tx.swapWidthHeight).toBe(true)
    expect(orientedSize(4032, 3024, tx)).toEqual({ width: 3024, height: 4032 })
  })

  it("orientation 3 is 180", () => {
    expect(orientationToTransform(3)!.rotate).toBe(180)
    expect(orientedSize(100, 50, orientationToTransform(3))).toEqual({ width: 100, height: 50 })
  })

  it("orientation 8 swaps dims", () => {
    const tx = orientationToTransform(8)!
    expect(tx.swapWidthHeight).toBe(true)
    expect(tx.rotate).toBe(270)
  })

  it("invalid orientation returns null", () => {
    expect(orientationToTransform(9)).toBeNull()
    expect(orientationToTransform(0)).toBeNull()
  })
})