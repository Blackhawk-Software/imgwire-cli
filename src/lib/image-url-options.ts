import type {ImageUrlOptions} from '@imgwire/node'

import {Flags} from '@oclif/core'

const imageUrlFlagToOption = {
  a: 'a',
  adjust: 'adjust',
  background: 'background',
  'background-alpha': 'background_alpha',
  bg: 'bg',
  bga: 'bga',
  bl: 'bl',
  blur: 'blur',
  br: 'br',
  brightness: 'brightness',
  c: 'c',
  'chroma-subsampling': 'chroma_subsampling',
  co: 'co',
  col: 'col',
  'color-profile': 'color_profile',
  colorize: 'colorize',
  contrast: 'contrast',
  cp: 'cp',
  crop: 'crop',
  dpi: 'dpi',
  dpr: 'dpr',
  dt: 'dt',
  duotone: 'duotone',
  el: 'el',
  enlarge: 'enlarge',
  ex: 'ex',
  exar: 'exar',
  ext: 'ext',
  extend: 'extend',
  'extend-ar': 'extend_ar',
  'extend-aspect-ratio': 'extend_aspect_ratio',
  extension: 'extension',
  f: 'f',
  fl: 'fl',
  flip: 'flip',
  format: 'format',
  g: 'g',
  gr: 'gr',
  gradient: 'gradient',
  gravity: 'gravity',
  h: 'h',
  height: 'height',
  hu: 'hu',
  hue: 'hue',
  icc: 'icc',
  kcr: 'kcr',
  'keep-copyright': 'keep_copyright',
  l: 'l',
  lightness: 'lightness',
  mc: 'mc',
  mh: 'mh',
  'min-height': 'min_height',
  'min-width': 'min_width',
  monochrome: 'monochrome',
  mw: 'mw',
  neg: 'neg',
  negate: 'negate',
  norm: 'norm',
  normalise: 'normalise',
  normalize: 'normalize',
  padding: 'padding',
  pd: 'pd',
  pix: 'pix',
  pixelate: 'pixelate',
  preset: 'preset',
  progressive: 'progressive',
  q: 'q',
  quality: 'quality',
  ra: 'ra',
  'resizing-algorithm': 'resizing_algorithm',
  'resizing-type': 'resizing_type',
  rot: 'rot',
  rotate: 'rotate',
  sa: 'sa',
  saturation: 'saturation',
  scp: 'scp',
  sh: 'sh',
  sharpen: 'sharpen',
  sm: 'sm',
  'strip-color-profile': 'strip_color_profile',
  'strip-metadata': 'strip_metadata',
  w: 'w',
  watermark: 'watermark',
  'watermark-offset': 'watermark_offset',
  'watermark-position': 'watermark_position',
  'watermark-rotate': 'watermark_rotate',
  'watermark-shadow': 'watermark_shadow',
  'watermark-size': 'watermark_size',
  'watermark-text': 'watermark_text',
  'watermark-url': 'watermark_url',
  width: 'width',
  wm: 'wm',
  'wm-rot': 'wm_rot',
  wmp: 'wmp',
  wmr: 'wmr',
  wms: 'wms',
  wmsh: 'wmsh',
  wmt: 'wmt',
  wmu: 'wmu',
  z: 'z',
  zoom: 'zoom',
} as const

type ImageUrlFlagName = keyof typeof imageUrlFlagToOption

export const imageUrlFlags = Object.fromEntries(
  Object.keys(imageUrlFlagToOption).map((flagName) => [
    flagName,
    Flags.string({
      description: `Set the ${flagName} image URL transform`,
    }),
  ]),
) as Record<ImageUrlFlagName, ReturnType<typeof Flags.string>>

export function buildImageUrlOptions(flags: Record<string, unknown>): ImageUrlOptions {
  const options: Record<string, unknown> = {}

  for (const [flagName, optionName] of Object.entries(imageUrlFlagToOption)) {
    const value = flags[flagName]

    if (value !== undefined) {
      options[optionName] = parseTransformValue(value)
    }
  }

  return options as ImageUrlOptions
}

function parseTransformValue(value: unknown): unknown {
  const normalized = Array.isArray(value) ? value.at(-1) : value

  if (typeof normalized !== 'string') {
    return normalized
  }

  const trimmed = normalized.trim()

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return JSON.parse(trimmed)
  }

  return trimmed
}
