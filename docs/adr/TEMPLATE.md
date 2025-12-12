# ADR-XXX: [Title]

**Status:** PROPOSED | ACCEPTED | DEPRECATED | SUPERSEDED

**Date:** YYYY-MM-DD

## Context

[What is the issue we're trying to solve?]

## Decision

[What did we decide to do?]

## Implementation Claims

<!-- IMPORTANT: List specific, verifiable claims -->

### Files Created/Modified
- [ ] `src/path/to/file.ts` - [Purpose]
- [ ] `src/path/to/other.ts` - [Purpose]

### Functions/Classes Implemented
- [ ] `functionName()` in `file.ts` - [Purpose]
- [ ] `ClassName` in `file.ts` - [Purpose]

### Verification Commands
```bash
# Verify files exist
Test-Path src/path/to/file.ts  # PowerShell
ls -la src/path/to/file.ts      # Bash

# Verify functions exist
Select-String -Path src/path/to/file.ts -Pattern "functionName"  # PowerShell
grep "functionName" src/path/to/file.ts                           # Bash

# Verify it compiles
npm run compile

# Verify it runs
npm run scan:cli
npm run validate:cli
```

## Verification Report

<!-- FILLED OUT AFTER IMPLEMENTATION -->

**Verification Date:** YYYY-MM-DD

**Results:**
- [ ] All files created: YES/NO
- [ ] All functions implemented: YES/NO
- [ ] Compiles without errors: YES/NO
- [ ] Tests pass: YES/NO
- [ ] Verification scripts pass: YES/NO (`npm run verify:all`)

**Evidence:**
```
[Paste grep/build/test output here]

Example:
✅ File exists: Test-Path src/cli/scan-cli.ts → True
✅ Function exists: Select-String -Path src/cli/scan-cli.ts -Pattern "runScanCli" → Found
✅ Compiles: npm run compile → Success
✅ Runs: npm run scan:cli → {"status":"success",...}
```

## Consequences

[What becomes easier or harder as a result?]

## Notes

[Additional context, alternatives considered, etc.]

