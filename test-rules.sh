#!/usr/bin/env bash
set -e

echo "Lucky Penny Craps - rules safety net"
echo "Compiling shared rules module..."

rm -rf .rules-test
mkdir -p .rules-test

npx tsc app/table/crapsRules.ts \
  --target ES2020 \
  --module commonjs \
  --esModuleInterop \
  --skipLibCheck \
  --outDir .rules-test

echo "Running rules tests..."
node --test tests/crapsRules.test.cjs

rm -rf .rules-test
echo "All Lucky Penny rules tests passed."
