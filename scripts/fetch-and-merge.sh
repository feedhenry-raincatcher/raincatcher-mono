#!/bin/bash
# git fetch --all
for repo in ./apps/* ./packages/*; do
  echo "Merging $(basename $repo)"
  git subtree pull --prefix=$repo $(basename $repo) master --squash || break
done