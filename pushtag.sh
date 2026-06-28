#!/usr/bin/env bash
set -euo pipefail

VERSION_FILE="version.txt"

if [ ! -f "$VERSION_FILE" ]; then
  echo "Missing $VERSION_FILE" >&2
  exit 1
fi

CURRENT_VERSION="$(tr -d '[:space:]' < "$VERSION_FILE")"
CURRENT_VERSION="${CURRENT_VERSION#v}"

if ! [[ "$CURRENT_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "$VERSION_FILE must contain a semantic version like 0.1.3" >&2
  exit 1
fi

IFS="." read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
NEXT_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
TAG="v$NEXT_VERSION"

echo "$NEXT_VERSION" > "$VERSION_FILE"

echo "==> Bumping version: $CURRENT_VERSION -> $NEXT_VERSION"
git add "$VERSION_FILE"
git commit -m "Release $TAG"

echo "==> Creating tag: $TAG"
git tag -a "$TAG" -m "Release $TAG"

echo "==> Pushing release commit and tag"
git push origin HEAD
git push origin "$TAG"

echo "==> Done. The GitHub Actions workflow should trigger."