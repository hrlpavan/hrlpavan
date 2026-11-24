#!/usr/bin/env python3
"""Autonomous GitHub & GitLab Dual-Remote Streak Maintainer.

Runs continuously or on schedule to:
1. Reconcile origin/main from GitHub.
2. Synchronize active streak & telemetry across streak.json, gitlab-telemetry.json,
   README.md, and unified-systems-console.svg.
3. Pulse telemetry if a new calendar day has started or on cadence.
4. Commit and push in lockstep to both GitHub and GitLab remotes.
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PULSE_JSON = ROOT / "assets" / "telemetry-pulse.json"
IST_OFFSET = timezone(timedelta(hours=5.5))


def run_cmd(cmd: list[str], cwd: Path = ROOT) -> tuple[int, str]:
    """Execute shell command and capture stdout/stderr."""
    res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    return res.returncode, (res.stdout + res.stderr).strip()


def sync_once(force_pulse: bool = False) -> bool:
    """Run a single iteration of dual-remote streak maintenance."""
    now_ist = datetime.now(IST_OFFSET)
    now_iso = now_ist.isoformat()
    today_str = now_ist.strftime("%Y-%m-%d")

    print(f"[{now_iso}] Starting Dual Streak Maintenance check...")

    # 1. Pull with rebase from origin main
    code, out = run_cmd(["git", "pull", "--rebase", "origin", "main"])
    if code != 0:
        print(f"[WARN] git pull --rebase warning: {out}", file=sys.stderr)

    # 2. Run update_daily_streak.py
    updater_script = ROOT / "scripts" / "update_daily_streak.py"
    if updater_script.exists():
        code, out = run_cmd([sys.executable, str(updater_script)])
        if code == 0:
            print(f"[OK] Telemetry updater completed: {out}")
        else:
            print(f"[WARN] Telemetry updater exited with code {code}: {out}", file=sys.stderr)

    # 3. Check git status to see if files changed
    code, status_out = run_cmd(["git", "status", "--porcelain", "assets", "README.md"])
    has_changes = bool(status_out.strip())

    # 4. Check if today already has a commit, or if pulse is required
    code, log_out = run_cmd(["git", "log", "-1", "--format=%ad", "--date=iso-local"])
    needs_pulse = force_pulse
    if not has_changes and not needs_pulse:
        # Check date of last commit in local time
        if today_str not in log_out:
            print(f"[INFO] No commit detected yet for today ({today_str}). Triggering telemetry pulse.")
            needs_pulse = True

    if needs_pulse:
        PULSE_JSON.parent.mkdir(parents=True, exist_ok=True)
        pulse_data = {
            "timestamp": now_iso,
            "date": today_str,
            "status": "synchronized",
            "remotes": ["git@github.com:hrlpavan/hrlpavan.git", "git@gitlab.com:hrlpavan/hrlpavan.git"],
        }
        PULSE_JSON.write_text(json.dumps(pulse_data, indent=2) + "\n", encoding="utf-8")
        has_changes = True

    # 5. Commit & Push to both GitHub and GitLab
    if has_changes:
        run_cmd(["git", "add", "assets/", "README.md"])
        commit_msg = f"chore(telemetry): auto-sync daily contribution streak & telemetry [{today_str}] [skip ci]"
        env = os.environ.copy()
        env["ANTIGRAVITY_SYNC_IN_PROGRESS"] = "1"
        res = subprocess.run(["git", "commit", "-m", commit_msg], cwd=ROOT, capture_output=True, text=True, env=env)
        if res.returncode == 0:
            print(f"[OK] Created commit: {commit_msg}")
            # Push to origin (which pushes to BOTH GitHub and GitLab)
            push_res = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, capture_output=True, text=True)
            if push_res.returncode == 0:
                print("[OK] Pushed in lockstep to GitHub and GitLab.")
                return True
            else:
                print(f"[WARN] Push failed: {push_res.stderr}", file=sys.stderr)
        else:
            print(f"[INFO] Nothing to commit or commit skipped: {res.stderr}")
    else:
        print("[INFO] Everything already up to date. No new commit needed.")

    return False


def main():
    parser = argparse.ArgumentParser(description="Maintain GitHub and GitLab streak in lockstep.")
    parser.add_argument("--daemon", action="store_true", help="Run continuously in background.")
    parser.add_argument("--interval", type=int, default=120, help="Interval in seconds for daemon mode (default: 120s / 2 min).")
    parser.add_argument("--pulse", action="store_true", help="Force pulse commit immediately.")
    args = parser.parse_args()

    if args.daemon:
        print(f"Starting Streak Maintenance Daemon (interval: {args.interval}s)...")
        while True:
            try:
                sync_once(force_pulse=args.pulse)
            except Exception as e:
                print(f"[ERROR] Exception during maintenance loop: {e}", file=sys.stderr)
            time.sleep(args.interval)
    else:
        sync_once(force_pulse=args.pulse)


if __name__ == "__main__":
    main()
