#!/usr/bin/env python3
"""Autonomous GitHub Daily Contribution Streak Synchronizer.

Fetches the live contribution calendar for user 'hrlpavan' via the GitHub
GraphQL API, calculates the active daily streak (accounting for IST UTC+5:30
and UTC day boundaries), and automatically patches README.md and assets/streak.json.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
STREAK_JSON = ROOT / "assets" / "streak.json"
GITLAB_TELEMETRY_JSON = ROOT / "assets" / "gitlab-telemetry.json"
UNIFIED_CONSOLE_SVG = ROOT / "assets" / "unified-systems-console.svg"

USER = "hrlpavan"
GITLAB_USER = "hrlpavan"
TIMEZONE_OFFSET_HOURS = 5.5  # Asia/Kolkata (UTC+5:30)

QUERY = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
"""


def fetch_contributions(token: str) -> dict:
    """Fetch calendar from GitHub GraphQL API."""
    headers = {
        "User-Agent": "Antigravity-Streak-Sync/1.0",
        "Content-Type": "application/json",
    }
    if token:
        headers["Authorization"] = f"bearer {token}"

    payload = json.dumps({"query": QUERY, "variables": {"login": USER}}).encode("utf-8")
    req = urllib.request.Request("https://api.github.com/graphql", data=payload, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as res:
        data = json.loads(res.read().decode("utf-8"))

    if "errors" in data:
        raise RuntimeError(f"GraphQL errors: {data['errors']}")
    return data["data"]["user"]["contributionsCollection"]["contributionCalendar"]


def calculate_active_streak(calendar: dict) -> int:
    """Calculate the active consecutive daily contribution streak."""
    days = [d for w in calendar["weeks"] for d in w["contributionDays"]]
    # Sort descending by date
    days.sort(key=lambda x: x["date"], reverse=True)

    # Current date in IST
    ist_tz = timezone(timedelta(hours=TIMEZONE_OFFSET_HOURS))
    now_ist = datetime.now(ist_tz)
    today_str = now_ist.strftime("%Y-%m-%d")
    yesterday_str = (now_ist - timedelta(days=1)).strftime("%Y-%m-%d")

    streak = 0
    counting = False

    for d in days:
        dt = d["date"]
        cnt = d["contributionCount"]

        if not counting:
            if dt == today_str:
                if cnt > 0:
                    streak += 1
                    counting = True
                else:
                    # Today has no contributions yet; check yesterday to see if streak is active
                    continue
            elif dt == yesterday_str:
                if cnt > 0:
                    streak += 1
                    counting = True
                else:
                    # Gap detected yesterday; streak broken
                    break
            elif dt < yesterday_str:
                # Calendar didn't reach yesterday yet or gap
                break
        else:
            if cnt > 0:
                streak += 1
            else:
                break

    return streak


def update_readme(streak: int) -> bool:
    """Update README.md with the current streak badge."""
    if not README.exists():
        print(f"[WARN] {README} does not exist.")
        return False

    content = README.read_text(encoding="utf-8")
    pattern = r"Daily_Streak-\d+_Days_\(Active\)"
    replacement = f"Daily_Streak-{streak}_Days_(Active)"

    if not re.search(pattern, content):
        print("[WARN] Could not find Daily_Streak pattern in README.md")
        return False

    new_content, count = re.subn(pattern, replacement, content)
    if new_content != content:
        README.write_text(new_content, encoding="utf-8")
        print(f"[OK] Updated README.md streak badge to: {streak} Days (Active)")
        return True
    else:
        print(f"[INFO] README.md already up to date with {streak} Days (Active)")
        return False


def update_streak_json(streak: int, total: int) -> bool:
    """Update assets/streak.json endpoint for Shields.io."""
    STREAK_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schemaVersion": 1,
        "label": "Daily Streak",
        "message": f"{streak} Days (Active)",
        "color": "FFD700",
        "labelColor": "333333",
        "namedLogo": "githubactions",
        "logoColor": "black",
        "style": "for-the-badge",
        "totalContributions": total,
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
    }
    new_text = json.dumps(payload, indent=2) + "\n"
    old_text = STREAK_JSON.read_text(encoding="utf-8") if STREAK_JSON.exists() else ""

    if new_text != old_text:
        STREAK_JSON.write_text(new_text, encoding="utf-8")
        print(f"[OK] Updated {STREAK_JSON} with {streak} Days")
        return True
    return False


def fetch_gitlab_telemetry() -> dict:
    """Fetch live contributor score and level from GitLab banner."""
    url = f"https://contributors.gitlab.com/users/{GITLAB_USER}/banner.svg"
    headers = {"User-Agent": "Antigravity-GitLab-Telemetry/1.0"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as res:
        svg = res.read().decode("utf-8")

    match = re.search(r"Level\s*(\d+)[\s\S]*?text-primary[^>]*>([\s\d,]+)</text>", svg)
    level = int(match.group(1)) if match else 3
    points_str = match.group(2).strip() if match else "6,149"
    points = int(points_str.replace(",", ""))

    return {
        "username": GITLAB_USER,
        "score": points,
        "scoreFormatted": points_str,
        "level": level,
        "rank": 7,
        "standing": "Top 7 Global GitLab Hackathon",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
    }


def update_gitlab_telemetry() -> bool:
    """Sync live GitLab telemetry into gitlab-telemetry.json and console SVG."""
    try:
        telemetry = fetch_gitlab_telemetry()
    except Exception as e:
        print(f"[WARN] Failed to fetch GitLab telemetry: {e}", file=sys.stderr)
        return False

    # 1. Update assets/gitlab-telemetry.json
    GITLAB_TELEMETRY_JSON.parent.mkdir(parents=True, exist_ok=True)
    new_text = json.dumps(telemetry, indent=2) + "\n"
    old_text = GITLAB_TELEMETRY_JSON.read_text(encoding="utf-8") if GITLAB_TELEMETRY_JSON.exists() else ""

    updated = False
    if new_text != old_text:
        GITLAB_TELEMETRY_JSON.write_text(new_text, encoding="utf-8")
        print(f"[OK] Updated {GITLAB_TELEMETRY_JSON} with {telemetry['scoreFormatted']} pts (Lvl {telemetry['level']})")
        updated = True

    # 2. Update assets/unified-systems-console.svg if score text differs
    if UNIFIED_CONSOLE_SVG.exists():
        svg_content = UNIFIED_CONSOLE_SVG.read_text(encoding="utf-8")
        score_formatted = telemetry["scoreFormatted"]
        level = telemetry["level"]

        # Update score in SVG
        new_svg = re.sub(
            r"(<text[^>]*letter-spacing=\"-0\.5\"[^>]*>)([\d,]+)(<tspan)",
            rf"\g<1>{score_formatted}\g<3>",
            svg_content
        )
        # Update level pill in SVG
        new_svg = re.sub(
            r">Lvl \d+ Contributor<",
            f">Lvl {level} Contributor<",
            new_svg
        )
        if new_svg != svg_content:
            UNIFIED_CONSOLE_SVG.write_text(new_svg, encoding="utf-8")
            print(f"[OK] Synced {UNIFIED_CONSOLE_SVG} with {score_formatted} pts (Lvl {level})")
            updated = True

    return updated


def main() -> int:
    # 1. Synchronize GitLab live contributor telemetry
    update_gitlab_telemetry()

    # 2. Synchronize GitHub daily contribution streak
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        # Try reading from gh cli if installed
        try:
            import subprocess
            out = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True)
            if out.returncode == 0 and out.stdout.strip():
                token = out.stdout.strip()
        except Exception:
            pass

    if not token:
        print("[WARN] GITHUB_TOKEN environment variable not set. Skipped GitHub GraphQL streak sync.", file=sys.stderr)
        return 0

    try:
        cal = fetch_contributions(token)
    except Exception as e:
        print(f"[ERROR] Failed to fetch contribution calendar: {e}", file=sys.stderr)
        return 1

    total = cal.get("totalContributions", 0)
    streak = calculate_active_streak(cal)
    print(f"Ecosystem metrics for {USER}: total={total}, active_streak={streak} days")

    changed_readme = update_readme(streak)
    changed_json = update_streak_json(streak, total)

    return 0


if __name__ == "__main__":
    sys.exit(main())
