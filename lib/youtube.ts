import { YoutubeTranscript } from "youtube-transcript";

export interface YouTubeMetadata {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  videoId: string;
  url: string;
}

export interface TranscriptSegment {
  text: string;
  offset: number; // in milliseconds or seconds
  duration: number;
}

export interface YouTubeTranscriptResult {
  metadata: YouTubeMetadata;
  fullText: string;
  segments: TranscriptSegment[];
}

/**
 * Extracts the 11-character video ID from any valid YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Handle standard watch URLs, youtu.be, shorts, and embeds
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetches video metadata via YouTube oEmbed API (no API key required)
 */
export async function getYouTubeMetadata(
  urlOrId: string
): Promise<YouTubeMetadata> {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) {
    throw new Error("Invalid YouTube URL or Video ID");
  }

  const standardUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    standardUrl
  )}&format=json`;

  try {
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      // Fallback metadata if oEmbed fails
      return {
        title: `YouTube Video (${videoId})`,
        authorName: "YouTube Creator",
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        videoId,
        url: standardUrl,
      };
    }

    const data = await res.json();
    return {
      title: data.title || `YouTube Video (${videoId})`,
      authorName: data.author_name || "YouTube Creator",
      thumbnailUrl:
        data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
      url: standardUrl,
    };
  } catch (err) {
    return {
      title: `YouTube Video (${videoId})`,
      authorName: "YouTube Creator",
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
      url: standardUrl,
    };
  }
}

/**
 * Format milliseconds / seconds to MM:SS or HH:MM:SS
 */
export function formatTimestamp(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Fetches video transcript and segments
 */
export async function fetchYouTubeTranscript(
  urlOrId: string
): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Please provide a valid YouTube link.");
  }

  const metadata = await getYouTubeMetadata(videoId);

  let rawTranscript: any[] = [];
  try {
    rawTranscript = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (primaryErr: any) {
    console.warn("Primary transcript fetch failed, trying language fallback:", primaryErr?.message);
    try {
      rawTranscript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "en",
      });
    } catch (secondErr: any) {
      throw new Error(
        "Could not load transcript for this YouTube video. The video creator may have disabled subtitles or closed captions."
      );
    }
  }

  if (!rawTranscript || rawTranscript.length === 0) {
    throw new Error(
      "No transcript or subtitles found for this video. Please try a video with closed captions enabled."
    );
  }

  // Format full text with periodic timestamp markers (every ~30-45 seconds or sentence group)
  const segments: TranscriptSegment[] = rawTranscript.map((item) => ({
    text: item.text.replace(/&amp;#39;/g, "'").replace(/&quot;/g, '"'),
    offset: Math.floor(item.offset / 1000), // convert to seconds
    duration: Math.floor(item.duration / 1000),
  }));

  // Build readable document with timestamp markers
  let fullText = `Title: ${metadata.title}\nChannel: ${metadata.authorName}\nURL: ${metadata.url}\n\n--- VIDEO TRANSCRIPT ---\n\n`;

  let lastMarkerTime = -60;
  for (const seg of segments) {
    if (seg.offset - lastMarkerTime >= 45) {
      fullText += `\n[${formatTimestamp(seg.offset)}] `;
      lastMarkerTime = seg.offset;
    }
    fullText += `${seg.text} `;
  }

  return {
    metadata,
    fullText: fullText.trim(),
    segments,
  };
}
