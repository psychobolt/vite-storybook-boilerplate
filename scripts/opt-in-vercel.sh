#!/bin/bash

# Modify this script to configure Vercel deployment only on specific branches
# https://vercel.com/docs/monorepos#ignoring-the-build-step

# If you do not use a similiar setup, you may remove this file

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" != "bitbucket" ]] ; then
  if yarn dlx turbo-ignore 2> /dev/null; then
    # Don't build
    echo "🛑 - Build cancelled"
    exit 0;
  else
    # Proceed with the build
    echo "✅ - Build can proceed"
    exit 1;
  fi
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi