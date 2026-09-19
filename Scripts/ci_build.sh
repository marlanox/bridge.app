#!/bin/sh
# Generic headless build for any macOS CI runner (Xcode Cloud custom scripts, GitHub Actions,
# Codemagic, Bitrise, a Jenkins mac agent, or a local terminal) — nothing here assumes a
# particular provider. Builds for the simulator by default so it works without a signing
# team configured; pass ACTION=archive (with DEVELOPMENT_TEAM set) to produce a signed
# archive instead.
#
# Usage:
#   Scripts/ci_build.sh                              # simulator build, no signing needed
#   ACTION=archive DEVELOPMENT_TEAM=ABCDE12345 \
#     Scripts/ci_build.sh                             # signed archive at build/Bridge.xcarchive
set -eu

cd "$(dirname "$0")/.."

ACTION="${ACTION:-build}"
SCHEME="${SCHEME:-Bridge}"
CONFIGURATION="${CONFIGURATION:-Release}"

"$(dirname "$0")/bootstrap.sh"

if [ "$ACTION" = "archive" ]; then
  xcodebuild archive \
    -project Bridge.xcodeproj \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath build/Bridge.xcarchive \
    -destination "generic/platform=iOS" \
    -allowProvisioningUpdates \
    ${DEVELOPMENT_TEAM:+DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM"}
else
  xcodebuild "$ACTION" \
    -project Bridge.xcodeproj \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -destination "platform=iOS Simulator,name=iPhone 15"
fi
