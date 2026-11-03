#!/usr/bin/env python3
"""Deterministic verification test for GitLab & Streak Telemetry."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STREAK_JSON = ROOT / "assets" / "streak.json"
GITLAB_JSON = ROOT / "assets" / "gitlab-telemetry.json"
CONSOLE_SVG = ROOT / "assets" / "unified-systems-console.svg"


def test_streak_json():
    assert STREAK_JSON.exists(), f"Missing {STREAK_JSON}"
    data = json.loads(STREAK_JSON.read_text())
    assert "Days (Active)" in data.get("message", ""), f"Invalid streak message: {data}"
    assert data.get("totalContributions", 0) > 0, f"Total contributions invalid: {data}"
    print("[PASS] test_streak_json")


def test_gitlab_telemetry_json():
    assert GITLAB_JSON.exists(), f"Missing {GITLAB_JSON}"
    data = json.loads(GITLAB_JSON.read_text())
    assert data.get("username") == "hrlpavan"
    assert data.get("score", 0) >= 6149, f"Unexpected score: {data}"
    assert data.get("level") == 3, f"Unexpected level: {data}"
    assert "Top 7 Global" in data.get("standing", "")
    print("[PASS] test_gitlab_telemetry_json")


def test_console_svg():
    assert CONSOLE_SVG.exists(), f"Missing {CONSOLE_SVG}"
    svg = CONSOLE_SVG.read_text()
    assert "6,149" in svg, "Missing 6,149 points in console SVG"
    assert "Lvl 3 Contributor" in svg, "Missing Lvl 3 Contributor pill in console SVG"
    assert "Top 7 Global GitLab Hackathon" in svg, "Missing standing in console SVG"
    assert "Live CD / Merge Train Operational" in svg, "Missing live status chip in console SVG"
    print("[PASS] test_console_svg")


def test_svg_parser_regex():
    sample_svg = """
    <text class="text-secondary" x="73" y="102">Level 3</text>
    <text class="text-primary" x="73" y="130">6,149</text>
    """
    match = re.search(r"Level\s*(\d+)[\s\S]*?text-primary[^>]*>([\s\d,]+)</text>", sample_svg)
    assert match is not None
    assert int(match.group(1)) == 3
    assert match.group(2).strip() == "6,149"
    print("[PASS] test_svg_parser_regex")


if __name__ == "__main__":
    test_streak_json()
    test_gitlab_telemetry_json()
    test_console_svg()
    test_svg_parser_regex()
    print("ALL CHECKS PASSED.")
