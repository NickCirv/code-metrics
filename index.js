#!/usr/bin/env node
/**
 * code-metrics — zero-dependency lines-of-code analyzer
 * Like cloc but pure Node.js ES modules, no external deps.
 */

import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'fs';
import { join, extname, resolve, relative } from 'path';
import { createHash } from 'crypto';

// Language Map
const LANG_MAP = {
  '.js':    'JavaScript',
  '.mjs':   'JavaScript',
  '.cjs':   'JavaScript',
  '.ts':    'TypeScript',
  '.mts':   'TypeScript',
  '.cts':   'TypeScript',
  '.jsx':   'React JSX',
  '.tsx':   'React TSX',
  '.py':    'Python',
  '.rb':    'Ruby',
  '.go':    'Go',
  '.rs':    'Rust',
  '.java':  'Java',
  '.kt':    'Kotlin',
  '.kts':   'Kotlin',
  '.swift': 'Swift',
  '.cpp':   'C++',
  '.cc':    'C++',
  '.cxx':   'C++',
  '.c':     'C',
  '.h':     'C Header',
  '.hpp':   'C Header',
  '.cs':    'C#',
  '.php':   'PHP',
  '.html':  'HTML',
  '.htm':   'HTML',
  '.css':   'CSS',
  '.scss':  'SCSS',
  '.sass':  'SCSS',
  '.sql':   'SQL',
  '.sh':    'Shell',
  '.bash':  'Shell',
  '.zsh':   'Shell',
  '.json':  'JSON',
  '.yaml':  'YAML',
  '.yml':   'YAML',
  '.md':    'Markdown',
  '.mdx':   'Markdown',
  '.toml':  'TOML',
};

// Comment Syntax
const COMMENT_STYLES = {
  'JavaScript':  { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'TypeScript':  { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'React JSX':   { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'React TSX':   { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Go':          { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Rust':        { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'C':           { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'C Header':    { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'C++':         { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'C#':          { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Java':        { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Kotlin':      { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Swift':       { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'PHP':         { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'Python':      { line: '#',   blockStart: '"""',  blockEnd: '"""' },
  'Ruby':        { line: '#',   blockStart: '=begin', blockEnd: '=end' },
  'Shell':       { line: '#',   blockStart: null,   blockEnd: null },
  'SCSS':        { line: '//',  blockStart: '/*',   blockEnd: '*/' },
  'CSS':         { line: null,  blockStart: '/*',   blockEnd: '*/' },
  'HTML':        { line: null,  blockStart: '<!--', blockEnd: '-->' },
  'SQL':         { line: '--',  blockStart: '/*',   blockEnd: '*/' },
  'YAML':        { line: '#',   blockStart: null,   blockEnd: null },
  'TOML':        { line: '#',   blockStart: null,   blockEnd: null },
  'JSON':        { line: null,  blockStart: null,   blockEnd: null },
  'Markdown':    { line: null,  blockStart: '<!--', blockEnd: '-->' },
};

// Line Counter
function countLines(content, lang) {
  const style = COMMENT_STYLES[lang];
  const lines = content.split('\n');
  let blank = 0, comment = 0, code = 0, inBlock = false;

  for (const raw of lines) {
    const trimmed = raw.trim();

    if (trimmed === '') { blank++; continue; }
    if (!style) { code++; continue; }

    if (!inBlock && style.blockStart && trimmed.includes(style.blockStart)) {
      const startIdx = trimmed.indexOf(style.blockStart);
      const afterStart = trimmed.slice(startIdx + style.blockStart.length);
      if (style.blockEnd && afterStart.includes(style.blockEnd)) {
        comment++;
        continue;
      }
      inBlock = true;
      comment++;
      continue;
    }

    if (inBlock) {
      comment++;
      if (style.blockEnd && trimmed.includes(style.blockEnd)) inBlock = false;
      continue;
    }

    if (style.line && trimmed.startsWith(style.line)) { comment++; continue; }
    code++;
  }

  return { blank, comment, code, total: lines.length };
}

// File Walker
function walk(dir, excludeSet) {
  const results = [];
  function recurse(current) {
    let entries;
    try { entries = readdirSync(current, { withFileTypes: true }); }
    catch { return; }
    for (const entry of entries) {
      const fullPath = join(current, entry.name);
      if (excludeSet.has(entry.name)) continue;
      if (entry.isDirectory()) { recurse(fullPath); }
      else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (LANG_MAP[ext]) results.push({ path: fullPath, ext, lang: LANG_MAP[ext] });
      }
    }
  }
  recurse(dir);
  return results;
}

// Analyze Single File
function analyzeFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const lang = LANG_MAP[ext];
  if (!lang) return null;
  let content;
  try { content = readFileSync(filePath, 'utf8'); }
  catch { return null; }
  return { path: filePath, lang, ...countLines(content, lang) };
}

// Aggregate by language
function aggregate(files) {
  const byLang = {};
  for (const f of files) {
    if (!byLang[f.lang]) byLang[f.lang] = { language: f.lang, files: 0, blank: 0, comment: 0, code: 0 };
    byLang[f.lang].files++;
    byLang[f.lang].blank   += f.blank;
    byLang[f.lang].comment += f.comment;
    byLang[f.lang].code    += f.code;
  }
  return Object.values(byLang).sort((a, b) => b.code - a.code);
}

// Aggregate by directory
function aggregateByDir(files, baseDir) {
  const byDir = {};
  for (const f of files) {
    const rel = relative(baseDir, f.path);
    const parts = rel.split('/');
    const dir = parts.length > 1 ? parts[0] : '.';
    if (!byDir[dir]) byDir[dir] = [];
    byDir[dir].push(f);
  }
  return Object.entries(byDir)
    .map(([dir, dirFiles]) => {
      const rows = aggregate(dirFiles);
      const totals = rows.reduce(
        (a, r) => ({ files: a.files + r.files, blank: a.blank + r.blank, comment: a.comment + r.comment, code: a.code + r.code }),
        { files: 0, blank: 0, comment: 0, code: 0 }
      );
      return { dir, rows, totals };
    })
    .sort((a, b) => b.totals.code - a.totals.code);
}

// History
const HISTORY_FILE = '.code-metrics-history.json';

function loadHistory() {
  if (!existsSync(HISTORY_FILE)) return null;
  try { return JSON.parse(readFileSync(HISTORY_FILE, 'utf8')); }
  catch { return null; }
}

function saveHistory(rows, dir) {
  const entry = {
    timestamp: new Date().toISOString(),
    dir: resolve(dir),
    hash: createHash('sha256').update(JSON.stringify(rows)).digest('hex').slice(0, 8),
    rows: rows.map(r => ({ language: r.language, files: r.files, blank: r.blank, comment: r.comment, code: r.code })),
  };
  writeFileSync(HISTORY_FILE, JSON.stringify(entry, null, 2));
}

function diffHistory(current, previous) {
  const prevMap = Object.fromEntries(previous.rows.map(r => [r.language, r]));
  return current.map(row => {
    const prev = prevMap[row.language];
    return {
      ...row,
      delta: prev
        ? { files: row.files - prev.files, code: row.code - prev.code, comment: row.comment - prev.comment, blank: row.blank - prev.blank }
        : null,
    };
  });
}

// Formatters
const fmtNum = n => n.toLocaleString('en-US');
const fmtDelta = n => n === 0 ? '' : (n > 0 ? `+${fmtNum(n)}` : fmtNum(n));
const padEnd = (s, l) => String(s) + ' '.repeat(Math.max(0, l - String(s).length));
const padStart = (s, l) => ' '.repeat(Math.max(0, l - String(s).length)) + String(s);

function printTable(rows, opts = {}) {
  const { showDelta = false, prevTimestamp = null } = opts;
  if (prevTimestamp) console.log(`\nComparing vs run: ${prevTimestamp}\n`);

  const header = ['Language', 'Files', 'Blank', 'Comment', 'Code'];
  if (showDelta) header.push('Delta Code');

  const colWidths = header.map(h => h.length);

  const data = rows.map(r => {
    const row = [r.language, fmtNum(r.files), fmtNum(r.blank), fmtNum(r.comment), fmtNum(r.code)];
    if (showDelta) row.push(r.delta ? fmtDelta(r.delta.code) : 'NEW');
    return row;
  });

  const totals = rows.reduce(
    (a, r) => ({ files: a.files + r.files, blank: a.blank + r.blank, comment: a.comment + r.comment, code: a.code + r.code }),
    { files: 0, blank: 0, comment: 0, code: 0 }
  );
  const totalDeltaCode = showDelta
    ? rows.reduce((a, r) => a + (r.delta ? r.delta.code : r.code), 0)
    : null;

  const totalsRow = ['SUM', fmtNum(totals.files), fmtNum(totals.blank), fmtNum(totals.comment), fmtNum(totals.code)];
  if (showDelta) totalsRow.push(fmtDelta(totalDeltaCode));

  for (const row of [...data, totalsRow]) {
    row.forEach((cell, i) => { colWidths[i] = Math.max(colWidths[i], String(cell).length); });
  }

  const sep = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const fmt = row => '| ' + row.map((cell, i) => i === 0 ? padEnd(cell, colWidths[i]) : padStart(cell, colWidths[i])).join(' | ') + ' |';

  console.log(sep);
  console.log(fmt(header));
  console.log(sep);
  for (const row of data) console.log(fmt(row));
  console.log(sep);
  console.log(fmt(totalsRow));
  console.log(sep);
  console.log();
}

function printByDir(groups) {
  for (const { dir, rows } of groups) {
    console.log(`\n  Directory: ${dir}/`);
    console.log(`  ${'─'.repeat(50)}`);
    printTable(rows);
  }
}

function printJson(rows) {
  const totals = rows.reduce(
    (a, r) => ({ files: a.files + r.files, blank: a.blank + r.blank, comment: a.comment + r.comment, code: a.code + r.code }),
    { files: 0, blank: 0, comment: 0, code: 0 }
  );
  console.log(JSON.stringify({ languages: rows, totals }, null, 2));
}

function printCsv(rows) {
  console.log('Language,Files,Blank,Comment,Code');
  for (const r of rows) console.log(`${r.language},${r.files},${r.blank},${r.comment},${r.code}`);
  const t = rows.reduce(
    (a, r) => ({ files: a.files + r.files, blank: a.blank + r.blank, comment: a.comment + r.comment, code: a.code + r.code }),
    { files: 0, blank: 0, comment: 0, code: 0 }
  );
  console.log(`SUM,${t.files},${t.blank},${t.comment},${t.code}`);
}

// CLI Arg Parser
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    dir: '.',
    top: null,
    lang: null,
    exclude: new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '__pycache__', '.cache']),
    format: 'table',
    byDir: false,
    history: false,
    file: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--top':       opts.top = parseInt(args[++i], 10); break;
      case '--lang':      opts.lang = new Set(args[++i].split(',').map(l => l.trim().toLowerCase())); break;
      case '--exclude': { const extra = args[++i].split(',').map(s => s.trim()); for (const e of extra) opts.exclude.add(e); break; }
      case '--format':    opts.format = args[++i]; break;
      case '--by-dir':    opts.byDir = true; break;
      case '--history':   opts.history = true; break;
      case '--file':      opts.file = args[++i]; break;
      case '--help': case '-h': printHelp(); process.exit(0); break;
      case '--version': case '-v': console.log('code-metrics v1.0.0'); process.exit(0); break;
      default: if (!arg.startsWith('--')) opts.dir = arg;
    }
  }
  return opts;
}

function printHelp() {
  console.log(`
code-metrics v1.0.0 — zero-dependency lines-of-code analyzer

USAGE
  cmetrics [dir] [options]
  code-metrics [dir] [options]

OPTIONS
  [dir]                 Directory to analyze (default: .)
  --top <n>             Show only top N languages by code lines
  --lang <ext,...>      Filter to extensions: js,ts,py
  --exclude <dirs,...>  Exclude additional directories
  --format <fmt>        Output format: table (default), json, csv
  --by-dir              Group results by top-level directory
  --history             Compare vs previous run (.code-metrics-history.json)
  --file <path>         Analyze a single file
  --version, -v         Show version
  --help, -h            Show this help

EXAMPLES
  cmetrics .
  cmetrics ./src --top 5
  cmetrics . --lang js,ts --format json
  cmetrics . --by-dir
  cmetrics . --history
  cmetrics --file index.js

LANGUAGES (25+)
  JavaScript, TypeScript, React JSX, React TSX, Python, Ruby, Go,
  Rust, Java, Kotlin, Swift, C++, C, C Header, C#, PHP, HTML, CSS,
  SCSS, SQL, Shell, JSON, YAML, Markdown, TOML
`);
}

// Main
function main() {
  const opts = parseArgs(process.argv);

  if (opts.file) {
    const result = analyzeFile(resolve(opts.file));
    if (!result) { console.error(`Cannot analyze: ${opts.file}`); process.exit(1); }
    if (opts.format === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      printTable([{ language: result.lang, files: 1, blank: result.blank, comment: result.comment, code: result.code }]);
      console.log(`File: ${result.path}`);
    }
    return;
  }

  const targetDir = resolve(opts.dir);
  let stat;
  try { stat = statSync(targetDir); }
  catch { console.error(`Directory not found: ${targetDir}`); process.exit(1); }
  if (!stat.isDirectory()) { console.error(`Not a directory: ${targetDir}`); process.exit(1); }

  const allFiles = walk(targetDir, opts.exclude);
  let files = allFiles;
  if (opts.lang) {
    files = allFiles.filter(f => {
      const ext = f.ext.replace('.', '').toLowerCase();
      return opts.lang.has(ext) || opts.lang.has(f.lang.toLowerCase());
    });
  }

  if (files.length === 0) { console.log('No matching source files found.'); return; }

  const analyzed = files.map(f => {
    let content;
    try { content = readFileSync(f.path, 'utf8'); }
    catch { return null; }
    return { path: f.path, lang: f.lang, ...countLines(content, f.lang) };
  }).filter(Boolean);

  let rows = aggregate(analyzed);
  if (opts.top) rows = rows.slice(0, opts.top);

  if (opts.history) {
    const prev = loadHistory();
    if (prev) {
      const withDelta = diffHistory(rows, prev);
      if (opts.format === 'table') printTable(withDelta, { showDelta: true, prevTimestamp: prev.timestamp });
      else if (opts.format === 'json') printJson(withDelta);
      else if (opts.format === 'csv') printCsv(withDelta);
    } else {
      console.log('No previous run found. Saving baseline...\n');
      if (opts.format === 'table') printTable(rows);
    }
    saveHistory(rows, targetDir);
    return;
  }

  saveHistory(rows, targetDir);

  if (opts.byDir) {
    const groups = aggregateByDir(analyzed, targetDir);
    if (opts.format === 'table') printByDir(groups);
    else if (opts.format === 'json') console.log(JSON.stringify(groups, null, 2));
    else if (opts.format === 'csv') { for (const { dir, rows: dr } of groups) { console.log(`\n# ${dir}`); printCsv(dr); } }
    return;
  }

  if (opts.format === 'table') {
    console.log(`\nAnalyzing: ${targetDir}\n`);
    printTable(rows);
    console.log(`${analyzed.length} files analyzed`);
  } else if (opts.format === 'json') {
    printJson(rows);
  } else if (opts.format === 'csv') {
    printCsv(rows);
  } else {
    console.error(`Unknown format: ${opts.format}`);
    process.exit(1);
  }
}

main();
