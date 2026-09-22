# code-metrics — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`da34b38cc59a2950d9fd462ff16b55f23c1e65f1`](https://github.com/NickCirv/code-metrics/commit/da34b38cc59a2950d9fd462ff16b55f23c1e65f1).
- Tree: `87a9a612f20bdd5fa49a81184f14592fab03c657`; truncated: `false`.
- Capture: 6 of 6 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/package.json) | Source declaration inspected; runtime unverified |
| Counts code, comment and blank lines by language and directory. | [index.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/index.js) | Implementation interfaces inspected; behavior not executed |
| Recursive source discovery; per-language and per-directory summaries; saved metric comparisons. | [index.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/index.js) | Source-backed scope, not a test result |
| Language recognition and comment counting are heuristic. Line counts measure repository shape, not code quality or individual productivity. History features write a local file. | [index.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/index.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

Language recognition and comment counting are heuristic. Line counts measure repository shape, not code quality or individual productivity. History features write a local file.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/README.md) | `9be0307676629896a67c0f4926487c814cbedbd3cf1d5192be0424972f1b6679` | 2355 |
| [package.json](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/package.json) | `e7ffadd99c041dee6bc9c3bfc8c8371b3510ff6ef3dc04b325c93175b1f69d78` | 910 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/.github/workflows/ci.yml) | `e818f4e6bd805f798665dbbf04964d02f12fc59dd7f18903ad63d26d374ae3f0` | 380 |
| [index.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/index.js) | `60d18c2f5a0516e537fa613c41630c8786c05fedacdbdebff65a4347ef26e005` | 15081 |
| [test/smoke.test.js](https://github.com/NickCirv/code-metrics/blob/da34b38cc59a2950d9fd462ff16b55f23c1e65f1/test/smoke.test.js) | `31178f9e769b3cc662acbdb5a9984a51a26132adb2f1a6ecf1b6d94cc9470c1f` | 338 |
