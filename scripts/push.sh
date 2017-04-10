#!/bin/bash
if (( "$#" <= 2 ))
then
  echo 'Usage: push [packages|apps]/module <<remote-gitref>> <<remote-prefix>>'
  echo 'supply remote-prefix if you want to push to a conventionally-named remote like {my-fork}-raincatcher-demo-cloud'
  exit 1
fi
git subtree push --prefix=$1 $3-$(basename $1) $2