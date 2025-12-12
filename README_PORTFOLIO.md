# Noyrax - Documentation that never drifts

<p align="center">
  <img src="https://via.placeholder.com/120x120/2563EB/FFFFFF?text=NX" alt="Noyrax Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Built in 2 months. No CS degree. Open source.</strong>
</p>

<p align="center">
  <a href="https://github.com/noyrax/noyrax"><strong>View on GitHub</strong></a> •
  <a href="https://marketplace.visualstudio.com/items?itemName=noyrax.noyrax"><strong>VS Code Extension</strong></a>
</p>

---

## The Problem

> **80% of documentation is outdated.** Developers change code, but not docs. Code reviews don't catch it. CI doesn't check it.

**Impact:**
- Onboarding takes weeks instead of days
- Bugs caused by outdated documentation
- Wasted time searching for correct information
- Technical debt accumulates silently

## The Solution

**Noyrax** – An AI-native documentation system that automatically generates, validates, and maintains documentation.

**Built in 2 months** with:
- TypeScript
- VS Code Extension API
- MCP-Server (Model Context Protocol)
- Reality-Driven Development principles

## Key Metrics

| Metric | Value |
|--------|-------|
| **Modules Documented** | 71 |
| **MCP-Server Resources** | 99 |
| **Architecture Decision Records** | 27 |
| **Supported Languages** | 4 (TypeScript, Python, JSON/YAML, Markdown) |
| **Verification Scripts** | 3 (Architecture, ADRs, Imports) |

## Use Cases

### 1. Automatic Documentation Generation

**Problem:** Developers don't write documentation because it's tedious and gets outdated quickly.

**Solution:** Noyrax automatically generates Markdown documentation from code signatures, comments, and structure.

**Result:** 
- Documentation stays in sync with code automatically
- No manual maintenance required
- Deterministic and reproducible output

### 2. Drift Detection in CI/CD

**Problem:** Documentation drifts from code, causing confusion and bugs.

**Solution:** Noyrax validates documentation against code signatures in CI/CD pipelines.

**Result:**
- Merge requests blocked if documentation is outdated
- Early detection of documentation drift
- Automated alerts when signatures change

### 3. AI-Agent Integration (Cursor, Copilot)

**Problem:** AI agents need structured access to code documentation and architecture decisions.

**Solution:** Noyrax provides a 5-dimensional navigation space via MCP-Server with 99 resources.

**Result:**
- AI agents can navigate codebase intelligently
- Structured access to documentation, dependencies, and ADRs
- Impact analysis for code changes

### 4. Multi-Dimensional Navigation Space for AI Agents

**Problem:** AI agents struggle to understand codebase structure and relationships.

**Solution:** Noyrax generates a coordinate system with 5 dimensions:
- **Module Space (X)**: API documentation per file
- **Symbol Space (Y)**: Symbols with dependencies
- **Relationship Space (Z)**: Module dependencies
- **Knowledge Space (W)**: Architecture Decision Records
- **Time Space (T)**: Changes over time

**Result:**
- AI agents can navigate codebase like a map
- Understand relationships between modules
- Track changes over time
- Access architecture decisions contextually

## Technical Highlights

### Built with Modern Technologies

- **TypeScript** – Type-safe, maintainable code
- **VS Code Extension API** – Native IDE integration
- **MCP-Server** – Structured AI-Agent communication
- **Reality-Driven Development** – Verification loops prevent hallucinations

### Architecture

- **Modular Design** – Extensible plugin architecture
- **Incremental Updates** – Only processes changed files
- **Deterministic Output** – Same input → same output
- **Multi-Language Support** – TypeScript, Python, JSON/YAML, Markdown

### Key Features

- **Semantic Intelligence**: Role-based documentation depth (service-api, domain-model, config, infra, other)
- **Signature Formatting**: Centralized signature formatting for consistency
- **ADR Linking**: Automatic linking of Architecture Decision Records to modules
- **Reality-Driven Development**: Verification scripts prevent AI agent hallucinations

## Impact

### For Developers

- ✅ Documentation stays in sync automatically
- ✅ Less time writing documentation
- ✅ Faster onboarding for new team members
- ✅ Better code understanding

### For Teams

- ✅ Reduced technical debt
- ✅ Better code reviews
- ✅ Automated documentation maintenance
- ✅ CI/CD integration

### For AI Agents

- ✅ Structured access to codebase
- ✅ Multi-dimensional navigation
- ✅ Impact analysis capabilities
- ✅ Architecture decision context

## Try It Yourself

### Quick Start

```bash
# Install VS Code Extension
code --install-extension noyrax.noyrax

# Or initialize project
npx noyrax init
```

### Links

- **GitHub**: [github.com/noyrax/noyrax](https://github.com/noyrax/noyrax)
- **VS Code Marketplace**: [marketplace.visualstudio.com/items?itemName=noyrax.noyrax](https://marketplace.visualstudio.com/items?itemName=noyrax.noyrax)
- **Documentation**: See `docs/` directory in repository

## Built In Public

This project was built in public, documenting every decision and challenge:

- **27 Architecture Decision Records** – Every major decision documented
- **System Analysis** – Complete system documentation
- **Verification Scripts** – Automated reality checks
- **Open Source** – MIT License

## About

Built by [Benjamin Behrens](https://github.com/benjamin-behrens) in 2 months.

**No CS degree. Just passion for solving real problems.**

---

<p align="center">
  <sub>Built with ❤️ for developers who care about documentation.</sub>
</p>

