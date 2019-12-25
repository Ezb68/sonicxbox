#!/usr/bin/env bash

(
cd packages/sonicxwrap/sonicxweb
git reset --hard
git checkout master
git pull origin master
yarn install
yarn build
)
