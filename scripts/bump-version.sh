#!/bin/bash

# Version bump script for Carni Kridi App
# Usage: ./scripts/bump-version.sh [patch|minor|major]

set -e

BUMP_TYPE=${1:-patch}

echo "🔄 Bumping $BUMP_TYPE version..."

# Get current version
CURRENT_VERSION=$(node -p "require('./app.json').expo.version")
echo "Current version: $CURRENT_VERSION"

# Split version into parts
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Calculate new version based on bump type
case $BUMP_TYPE in
  "major")
    NEW_MAJOR=$((MAJOR + 1))
    NEW_VERSION="$NEW_MAJOR.0.0"
    ;;
  "minor")
    NEW_MINOR=$((MINOR + 1))
    NEW_VERSION="$MAJOR.$NEW_MINOR.0"
    ;;
  "patch")
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    ;;
  *)
    echo "❌ Invalid bump type. Use: patch, minor, or major"
    exit 1
    ;;
esac

echo "New version: $NEW_VERSION"

# Update app.json
node -e "
  const fs = require('fs');
  const appConfig = require('./app.json');
  appConfig.expo.version = '$NEW_VERSION';
  appConfig.expo.android.versionCode = appConfig.expo.android.versionCode + 1;
  fs.writeFileSync('./app.json', JSON.stringify(appConfig, null, 2));
"

# Update package.json
npm version $NEW_VERSION --no-git-tag-version

echo "✅ Version bumped to $NEW_VERSION"
echo "📝 Don't forget to commit these changes!"
