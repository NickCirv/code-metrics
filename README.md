# code-metrics

Measure lines of code, comments, and blank lines by language — like `cloc` but **zero-dependency Node.js**.

No npm install. No external packages. Pure Node.js built-ins (`fs`, `path`, `crypto`). ES modules. Node 18+.

## Quick Start

```bash
npx code-metrics .
```

Or install globally:

```bash
npm install -g code-metrics
cmetrics .
```

## Usage

```
cmetrics [dir] [options]
code-metrics [dir] [options]
```

## Options

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

## Examples

```bash
# Analyze current directory
cmetrics .

# Top 5 languages in ./src
cmetrics ./src --top 5

# Only JS and TS files, JSON output
cmetrics . --lang js,ts --format json

# Group by top-level directory
cmetrics . --by-dir

# Compare to previous run (history diff)
cmetrics . --history

# Analyze a single file
cmetrics --file index.js

# Exclude additional dirs
cmetrics . --exclude "vendor,tmp,logs"

# CSV output for spreadsheets
cmetrics . --format csv > stats.csv
```

## Sample Output

```
Analyzing: /your/project

+------------+-------+-------+---------+-------+
| Language   | Files | Blank | Comment |  Code |
+------------+-------+-------+---------+-------+
| TypeScript |    42 |   834 |     621 | 5,201 |
| JavaScript |    18 |   312 |     198 | 2,104 |
| CSS        |     6 |    89 |      34 |   621 |
| HTML       |     4 |    45 |      12 |   388 |
| JSON       |     3 |     0 |       0 |    87 |
+------------+-------+-------+---------+-------+
| SUM        |    73 | 1,280 |     865 | 8,401 |
+------------+-------+-------+---------+-------+

73 files analyzed
```

## History / Diff

Run `--history` to compare the current snapshot to the previous one. A `.code-metrics-history.json` file is saved automatically on every run.

```bash
cmetrics .           # baseline saved
# ... make changes ...
cmetrics . --history # shows delta
```

```
+------------+-------+-------+---------+-------+------------+
| Language   | Files | Blank | Comment |  Code | Delta Code |
+------------+-------+-------+---------+-------+------------+
| TypeScript |    44 |   860 |     640 | 5,450 |       +249 |
| JavaScript |    18 |   312 |     198 | 2,104 |            |
+------------+-------+-------+---------+-------+------------+
```

## Supported Languages (25+)

| Extension(s) | Language |
|-------------|----------|
| `.js`, `.mjs`, `.cjs` | JavaScript |
| `.ts`, `.mts`, `.cts` | TypeScript |
| `.jsx` | React JSX |
| `.tsx` | React TSX |
| `.py` | Python |
| `.rb` | Ruby |
| `.go` | Go |
| `.rs` | Rust |
| `.java` | Java |
| `.kt`, `.kts` | Kotlin |
| `.swift` | Swift |
| `.cpp`, `.cc`, `.cxx` | C++ |
| `.c` | C |
| `.h`, `.hpp` | C Header |
| `.cs` | C# |
| `.php` | PHP |
| `.html`, `.htm` | HTML |
| `.css` | CSS |
| `.scss`, `.sass` | SCSS |
| `.sql` | SQL |
| `.sh`, `.bash`, `.zsh` | Shell |
| `.json` | JSON |
| `.yaml`, `.yml` | YAML |
| `.md`, `.mdx` | Markdown |
| `.toml` | TOML |

## Default Excludes

`node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `__pycache__`, `.cache`

Add more with `--exclude "vendor,tmp"`.

## Comment Detection

| Languages | Line | Block |
|-----------|------|-------|
| JS/TS/Go/Rust/C/Java/C#/Kotlin/Swift/PHP | `//` | `/* */` |
| Python | `#` | `"""..."""` |
| Ruby | `#` | `=begin...=end` |
| Shell/YAML/TOML | `#` | — |
| CSS/SCSS | — | `/* */` |
| HTML/Markdown | — | `<!-- -->` |
| SQL | `--` | `/* */` |

## License

MIT
