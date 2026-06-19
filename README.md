<div align="center">

# code-metrics

**Count lines of code, comments, and blanks by language — zero-dependency Node.js alternative to cloc**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?labelColor=0B0A09)](LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?labelColor=0B0A09)](package.json)
[![Node ≥18](https://img.shields.io/badge/node-%3E%3D18-informational?labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/code-metrics .
```

Or install globally:

```bash
npm install -g github:NickCirv/code-metrics
cmetrics .
```

## Usage

```bash
# Analyze current directory
cmetrics .

# Top 5 languages in ./src, JSON output
cmetrics ./src --top 5 --format json

# Compare to previous run (track deltas)
cmetrics . --history
```

| Flag | Description |
|------|-------------|
| `[dir]` | Directory to analyze (default: `.`) |
| `--top <n>` | Show only top N languages by code lines |
| `--lang <ext,...>` | Filter to specific extensions: `js,ts,py` |
| `--exclude <dirs,...>` | Exclude additional directories |
| `--format <fmt>` | Output format: `table` (default), `json`, `csv` |
| `--by-dir` | Group results by top-level directory |
| `--history` | Compare vs previous run saved in `.code-metrics-history.json` |
| `--file <path>` | Analyze a single file |
| `--version, -v` | Show version |
| `--help, -h` | Show help |

## What it does

Walks a directory tree, classifies every source file by extension, and counts code, comment, and blank lines per language — printing a table, JSON, or CSV summary. Supports 25+ languages with accurate block-comment detection. A `.code-metrics-history.json` file is saved on each run so `--history` can show line-count deltas between snapshots.

## Sample output

```
+------------+-------+-------+---------+-------+
| Language   | Files | Blank | Comment |  Code |
+------------+-------+-------+---------+-------+
| TypeScript |    42 |   834 |     621 | 5,201 |
| JavaScript |    18 |   312 |     198 | 2,104 |
| CSS        |     6 |    89 |      34 |   621 |
+------------+-------+-------+---------+-------+
| SUM        |    66 | 1,235 |     853 | 7,926 |
+------------+-------+-------+---------+-------+
```

---
<sub>Zero dependencies · Node ≥18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
