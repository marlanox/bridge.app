#!/bin/sh
# Generates Bridge.xcodeproj from project.yml. Run this once after cloning (and again any
# time project.yml or the file tree under Bridge/ changes) before opening the project in
# Xcode. Works the same way locally or on any CI runner — nothing here is tied to a
# particular cloud build provider.
set -eu

cd "$(dirname "$0")/.."

if ! command -v xcodegen >/dev/null 2>&1; then
  echo "xcodegen not found." >&2
  if command -v brew >/dev/null 2>&1; then
    echo "Installing it with Homebrew..." >&2
    brew install xcodegen
  elif command -v mint >/dev/null 2>&1; then
    echo "Installing it with Mint..." >&2
    mint install yonaskolb/XcodeGen
  else
    echo "Install it yourself, then re-run this script:" >&2
    echo "  brew install xcodegen        # https://github.com/yonaskolb/XcodeGen" >&2
    echo "  mint install yonaskolb/XcodeGen" >&2
    exit 1
  fi
fi

xcodegen generate
echo "Generated Bridge.xcodeproj — open it, or continue with Scripts/ci_build.sh."
