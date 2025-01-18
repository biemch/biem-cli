#!/bin/bash

# This script automates the release process of a new project version.
# It ensures a clean working state, enforces semantic versioning,
# and creates a dedicated release branch.
#
# This process follows the Gitflow workflow strictly.
#
# How to Use:
# 1. Make sure you are on the 'develop' branch and your working directory is clean.
# 2. Ensure your local branch is up-to-date with 'origin/develop'.
# 3. Run the script with the desired version number:
#    ./release.sh <version>
#    Example: ./release.sh 1.2.3
# 4. The script will:
#    - Create a new release branch (e.g., 'release/1.2.3')
#    - Update the version in package.json (without committing the tag)
#    - Generate and update the CHANGELOG.md
#    - Commit the changes to the release branch
#    - Push the release branch to the remote repository
#    - Create a pull request (PR) to merge into the main branch
#
# Requirements:
# - Git installed and properly configured
# - npm (for versioning)
# - GitHub CLI (`gh`) installed and authenticated
# - Commitizen CLI (`cz`) installed and configured

##################################################
# CONFIGURATION
##################################################

# VERSION
#
# The version number to be used for the release,
# passed as the first argument to the script.
VERSION=$1

# DEVELOP_BRANCH
#
# The name of the develop branch, typically
# used for ongoing development.
DEVELOP_BRANCH="develop"

# RELEASE_BRANCH
#
# The name of the release branch, created for
# the specific version being released.
RELEASE_BRANCH="release/$VERSION"

# MAIN_BRANCH
#
# The name of the master branch, typically
# used for production-ready code.
MAIN_BRANCH="master"

##################################################
# CHECKS
##################################################

# Check if the current branch is the develop branch
if [ "$(git symbolic-ref --short HEAD)" != "$DEVELOP_BRANCH" ]; then
  echo "You must be on the develop branch to release a new version."
  exit 1
fi

# Check if there are any changes in the working directory
if [ -n "$(git status --porcelain)" ]; then
    echo "There are uncommitted changes in the working directory."
    exit 1
fi

# Check if there are any changes in the remote repository
if [ -n "$(git log HEAD..origin/$DEVELOP_BRANCH --oneline)" ]; then
  echo "There are changes in the remote repository."
  exit 1
fi

# Parse requested version from the command line
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

# Ensure the version number follows semver (no "v" prefix, etc.)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Version number must follow semver (e.g., 1.0.0)"
  exit 1
fi

###################################################
# RELEASE
##################################################

# Create a new release branch based on the develop branch
git checkout -b $RELEASE_BRANCH $DEVELOP_BRANCH > /dev/null 2>&1

# Update the version number in the project configuration
npm version $VERSION --no-git-tag-version

# Generate the changelog based using the commitizen tool
cz --config .config/commitizen/.cz.json changelog --template .config/commitizen/changelog-template.j2 --file-name CHANGELOG.md --incremental --unreleased-version $VERSION

# Stage the changes to the version and changelog
git add package.json CHANGELOG.md

# Commit the staged changes
git commit -m "chore(release): $VERSION"

# Push the release branch to the remote repository
git push origin $RELEASE_BRANCH

# Open a pull request for the release branch
gh pr create --base $MAIN_BRANCH --head $RELEASE_BRANCH --title "Release $VERSION" --body "Automated release PR for version $VERSION"
