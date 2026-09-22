# code-metrics — implementation reference

Source revision: `da34b38cc59a2950d9fd462ff16b55f23c1e65f1`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/package.json) declares `index.js`. Node.js `>=20` and npm.

Executable mapping: `code-metrics` → `./index.js`, `cmetrics` → `./index.js`.

## Supported workflow

Recursive source discovery; per-language and per-directory summaries; saved metric comparisons.

Language recognition and comment counting are heuristic. Line counts measure repository shape, not code quality or individual productivity. History features write a local file.

## Command reference

The commands below use the installed executable name. From the pinned checkout, replace it with the `node` entrypoint shown above. Options and command branches were cross-checked against captured source; examples are not execution transcripts.

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

## Package scripts

| Script | Exact command |
| --- | --- |
| `start` | `node index.js` |
| `test` | `node --test` |

## Implementation sources

[index.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
