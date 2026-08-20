export type AudioBitrate = 64 | 128 | 192 | 256 | 320

export type AudioOutputFormat = "mp3" | "wav"

export interface DecodedAudio {
  channelData: Float32Array[]
  sampleRate: number
  duration: number
  numberOfChannels: number
}

export interface AudioConvertOptions {
  file: File | Blob
  originalFileName?: string
  format: AudioOutputFormat
  bitrate?: AudioBitrate
  targetSampleRate?: number
}

export interface AudioConvertOutput {
  blob: Blob
  fileName: string
  format: AudioOutputFormat
  bytes: number
  duration: number
  sampleRate: number
  channels: number
  bitrate?: AudioBitrate
}
