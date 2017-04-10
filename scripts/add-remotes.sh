#!/usr/bin/env bash
for repo in ./apps/* ./packages/*; do
  name=$(basename $repo)
  remote="git@github.com:feedhenry-raincatcher/$name.git"
  if [[ "$#" -gt 0 ]]; then
    prefix=$1
    git remote add $name $prefix-$remote
  else
    git remote add $name $remote
  fi
done
git remote -v