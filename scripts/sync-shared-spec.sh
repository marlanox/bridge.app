#!/usr/bin/env bash
# Copies shared-spec/*.json (the canonical content) into pwa/content/ (the PWA's
# deployed copy) so the PWA and iOS stay reading the same room/deck/string data.
set -euo pipefail
cd "$(dirname "$0")/.."
cp shared-spec/*.json pwa/content/
echo "Synced shared-spec/*.json -> pwa/content/"
