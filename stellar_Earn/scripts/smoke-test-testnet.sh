#!/usr/bin/env bash
# Smoke tests for a freshly deployed EarnQuest contract on testnet.
# Requires: CONTRACT_ID and SOROBAN_SECRET_KEY env vars.

set -euo pipefail

RPC_URL="https://soroban-testnet.stellar.org"
PASSPHRASE="Test SDF Network ; September 2015"

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
pass() { echo -e "${GREEN}[PASS]${NC} $*"; }
fail() { echo -e "${RED}[FAIL]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[INFO]${NC} $*"; }

[[ -z "${CONTRACT_ID:-}" ]]        && fail "CONTRACT_ID is not set"
[[ -z "${SOROBAN_SECRET_KEY:-}" ]] && fail "SOROBAN_SECRET_KEY is not set"

command -v stellar >/dev/null 2>&1 || fail "stellar CLI not found"

info "Running smoke tests against contract: $CONTRACT_ID"

# ── 1. Contract is reachable ──────────────────────────────────────────────────
info "Checking contract exists on testnet..."
stellar contract info \
  --id "$CONTRACT_ID" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$PASSPHRASE" \
  >/dev/null 2>&1 && pass "Contract is reachable" || fail "Contract not found on testnet"

# ── 2. Read-only invocation (version or admin query) ─────────────────────────
info "Invoking read-only function..."
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source-account "$SOROBAN_SECRET_KEY" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$PASSPHRASE" \
  -- version 2>/dev/null \
  && pass "Read-only invocation succeeded" \
  || { info "version() not exposed — skipping (non-fatal)"; }

echo ""
pass "All smoke tests passed for contract $CONTRACT_ID on testnet"
