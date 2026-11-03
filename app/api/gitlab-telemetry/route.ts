import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 1800; // Cache for 30 minutes (SWR)

const GITLAB_HANDLE = 'hrlpavan';
const BANNER_URL = `https://contributors.gitlab.com/users/${GITLAB_HANDLE}/banner.svg`;

export async function GET() {
  try {
    const res = await fetch(BANNER_URL, {
      headers: {
        'User-Agent': 'Antigravity-GitLab-Telemetry/1.0',
        'Accept': 'image/svg+xml,text/plain,*/*'
      },
      next: { revalidate: 1800 }
    });

    if (!res.ok) {
      throw new Error(`GitLab banner returned status ${res.status}`);
    }

    const svg = await res.text();

    // Extract Level and Points from banner SVG
    const match = svg.match(/Level\s*(\d+)[\s\S]*?text-primary[^>]*>([\s\d,]+)<\/text>/i);
    const level = match ? parseInt(match[1], 10) : 3;
    const scoreStr = match ? match[2].trim() : '6,149';
    const score = parseInt(scoreStr.replace(/,/g, ''), 10) || 6149;

    return NextResponse.json({
      username: GITLAB_HANDLE,
      score,
      scoreFormatted: scoreStr,
      level,
      rank: 7,
      standing: 'Top 7 Global GitLab Hackathon',
      lastUpdated: new Date().toISOString(),
      fallback: false
    });
  } catch {
    // Resilient fallback to verified baseline so the UI never displays NaN or breaks
    return NextResponse.json({
      username: GITLAB_HANDLE,
      score: 6149,
      scoreFormatted: '6,149',
      level: 3,
      rank: 7,
      standing: 'Top 7 Global GitLab Hackathon',
      lastUpdated: new Date().toISOString(),
      fallback: true
    });
  }
}
