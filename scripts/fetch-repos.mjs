// Fetch public repos for a GitHub user and emit a trimmed JSON for the frontend.
// Runs at build time (see package.json -> build script).
// Optional: set GITHUB_TOKEN env var to lift the 60/hr unauthenticated limit.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = process.env.GITHUB_USER || 'ssandeep2197';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'src', 'data', 'projects.json');

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'helloworlds-portfolio-build',
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchAllRepos(user) {
  const repos = [];
  let page = 1;
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return repos;
}

function categorize(repo) {
  const lang = (repo.language || '').toLowerCase();
  if (['typescript', 'javascript', 'jsx', 'tsx'].includes(lang)) return 'web';
  if (['java', 'kotlin'].includes(lang)) return 'java';
  if (['python'].includes(lang)) return 'python';
  if (['html', 'css', 'scss'].includes(lang)) return 'web';
  if (['c', 'c++', 'c#', 'go', 'rust'].includes(lang)) return 'systems';
  return 'other';
}

function trim(repo) {
  return {
    id: repo.id,
    name: repo.name,
    title: repo.name
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description || '',
    repoUrl: repo.html_url,
    homepage: repo.homepage && /^https?:\/\//.test(repo.homepage) ? repo.homepage : null,
    language: repo.language,
    topics: repo.topics || [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    pushedAt: repo.pushed_at,
    year: new Date(repo.pushed_at).getFullYear().toString(),
    category: categorize(repo),
  };
}

async function main() {
  console.log(`[fetch-repos] Fetching repos for ${USER}…`);
  let repos;
  try {
    repos = await fetchAllRepos(USER);
  } catch (err) {
    console.error('[fetch-repos] Failed:', err.message);
    if (existsSync(OUT)) {
      console.warn('[fetch-repos] Keeping previous projects.json');
      process.exit(0);
    }
    // No prior data — write an empty array so the build doesn't break.
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, '[]\n');
    process.exit(0);
  }

  const projects = repos
    .filter((r) => !r.fork && !r.archived && !r.private)
    .map(trim)
    .sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(projects, null, 2) + '\n');
  console.log(`[fetch-repos] Wrote ${projects.length} projects -> ${OUT}`);
}

main();
