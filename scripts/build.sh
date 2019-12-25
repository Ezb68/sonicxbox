#!/usr/bin/env bash

rm -rf build
node_modules/.bin/babel --minified --source-maps-inline --no-comments src -d build
cp -r src/components/ContractSchema/spec build/components/ContractSchema/spec
cp scripts/sonicxbox.js build/.
chmod +x build/sonicxbox.js
