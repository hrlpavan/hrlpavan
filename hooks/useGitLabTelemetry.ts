import { useState, useEffect } from 'react';

export interface GitLabTelemetryData {
  username: string;
  score: number;
  scoreFormatted: string;
  level: number;
  rank: number;
  standing: string;
  lastUpdated: string;
  fallback: boolean;
}

const BASELINE_DATA: GitLabTelemetryData = {
  username: 'hrlpavan',
  score: 6149,
  scoreFormatted: '6,149',
  level: 3,
  rank: 7,
  standing: 'Top 7 Global GitLab Hackathon',
  lastUpdated: new Date().toISOString(),
  fallback: true,
};

export function useGitLabTelemetry() {
  const [data, setData] = useState<GitLabTelemetryData>(BASELINE_DATA);
  const [displayScore, setDisplayScore] = useState<number>(BASELINE_DATA.score);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTelemetry() {
      try {
        const res = await fetch('/api/gitlab-telemetry');
        if (res.ok) {
          const json: GitLabTelemetryData = await res.json();
          if (isMounted) {
            setData(json);
            setIsLive(!json.fallback);
            animateScore(json.score);
          }
        }
      } catch {
        if (isMounted) {
          setIsLive(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    function animateScore(target: number) {
      const start = Math.max(0, target - 100);
      const duration = 600; // ms
      const startTime = performance.now();

      function step(now: number) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (target - start) * progress);
        if (isMounted) {
          setDisplayScore(current);
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
      }

      requestAnimationFrame(step);
    }

    loadTelemetry();

    // Recheck every 15 minutes
    const interval = setInterval(loadTelemetry, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    ...data,
    displayScore,
    displayScoreFormatted: displayScore.toLocaleString(),
    isLoading,
    isLive,
  };
}
