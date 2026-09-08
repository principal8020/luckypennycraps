#!/usr/bin/env bash
set -e

echo "Lucky Penny Gaming - rules + strategy safety net"
echo "Compiling shared rules modules..."

rm -rf .rules-test
mkdir -p .rules-test

npx tsc app/table/crapsRules.ts app/table/strategyRules.ts app/blackjack/blackjackRules.ts \
  --target ES2020 \
  --module commonjs \
  --esModuleInterop \
  --skipLibCheck \
  --outDir .rules-test

echo "Running craps rules tests..."
node --test tests/crapsRules.test.cjs

echo "Running strategy rules tests..."
node --test tests/strategyRules.test.cjs

echo "Running blackjack rules tests..."
node --test tests/blackjackRules.test.cjs

rm -rf .rules-test
echo "All Lucky Penny rules and strategy tests passed."
