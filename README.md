![Nicholas Ashkar — code-metrics](assets/nicholas-ashkar/banner.png)

# code-metrics

Counts code, comment and blank lines by language and directory.






<a id="usage"></a>

<a id="analyze-current-directory"></a>

<a id="top-5-languages-in-src-json-output"></a>

<a id="compare-to-previous-run-track-deltas"></a>

<a id="sample-output"></a>

## What it does

- Recursive source discovery.
- Per-language and per-directory summaries.
- Saved metric comparisons.


<a id="install"></a>

## Quickstart

Prerequisites: Node.js `>=20` and npm. The checkout below pins the source used for this documentation.

```sh
git clone https://github.com/NickCirv/code-metrics.git
cd code-metrics
git checkout da34b38cc59a2950d9fd462ff16b55f23c1e65f1
node index.js .
```

**Expected behavior (illustrative, not captured):** Prints a language-oriented line-count summary for this checkout.

Examples are source-inspected, **not runtime-tested**. See the research record for verification gaps.

## Boundaries and data

Language recognition and comment counting are heuristic. Line counts measure repository shape, not code quality or individual productivity. History features write a local file.

## Development

The manifest defines `npm test` as:

```sh
node --test
```

The captured suite is a smoke check, not end-to-end behavior coverage. Examples include “entry is valid JavaScript”. Tests were not run for this documentation revision.

See [implementation and command reference](docs/REFERENCE.md) for the package scripts and inspected interfaces, and [research record](docs/RESEARCH.md) for the pinned source, document decisions and unresolved checks.

## License and contact

See [LICENSE](LICENSE) for the original terms and attribution. Legal text is unchanged.

[Nicholas Ashkar](https://nicholashkar.com/) · [Discuss a project](https://nicholashkar.com/#oxblood-contact)
