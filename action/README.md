# Noyrax GitHub Action

Validiere deine Dokumentation in GitHub Actions mit Noyrax.

## Quick Start

```yaml
name: Documentation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate Documentation
        uses: noyrax/noyrax/action@v1
        with:
          command: validate
          fail-on-drift: true
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `command` | Command to run: `scan`, `generate`, `validate`, `drift`, `full` | `validate` |
| `fail-on-drift` | Fail if drift is detected | `true` |
| `fail-on-coverage` | Fail if coverage is below threshold | `false` |
| `coverage-threshold` | Minimum coverage percentage | `80` |
| `config-path` | Path to noyrax.config.json | `noyrax.config.json` |
| `github-token` | GitHub token for PR comments | - |
| `working-directory` | Working directory | `.` |

## Outputs

| Output | Description |
|--------|-------------|
| `status` | Validation status: `success`, `drift`, or `error` |
| `coverage` | Documentation coverage percentage |
| `files-checked` | Number of files checked |
| `drift-count` | Number of files with drift |

## Examples

### Full Validation with PR Comments

```yaml
- name: Noyrax Validation
  uses: noyrax/noyrax/action@v1
  with:
    command: full
    fail-on-drift: true
    fail-on-coverage: true
    coverage-threshold: 90
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Drift Check Only

```yaml
- name: Check for Drift
  uses: noyrax/noyrax/action@v1
  with:
    command: drift
    fail-on-drift: true
```

### Generate Documentation

```yaml
- name: Generate Docs
  uses: noyrax/noyrax/action@v1
  with:
    command: generate

- name: Commit Generated Docs
  run: |
    git config --local user.email "action@github.com"
    git config --local user.name "GitHub Action"
    git add docs/
    git diff --staged --quiet || git commit -m "docs: update generated documentation"
    git push
```

### Coverage Gate

```yaml
- name: Check Coverage
  uses: noyrax/noyrax/action@v1
  with:
    command: validate
    fail-on-coverage: true
    coverage-threshold: 95
```

## PR Comment

Wenn du `github-token` angibst, kommentiert die Action automatisch auf PRs:

```markdown
## ✅ Noyrax Validation Report

| Metric | Value |
|--------|-------|
| Status | success |
| Coverage | 94% |
| Files Checked | 42 |
| Drift Detected | 0 |
```

## License

MIT

