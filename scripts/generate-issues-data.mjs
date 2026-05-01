import fs from 'fs';
import path from 'path';
import https from 'https';

const OWNER = 'xingbofeng';
const REPO = 'xingbofeng.github.io';
const PER_PAGE = 100;
const PUBLIC_PATH = path.join(process.cwd(), 'public', 'issues.json');

function requestJson(pathname) {
  return new Promise((resolve, reject) => {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'xingbofeng-blog-build',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const options = {
      hostname: 'api.github.com',
      path: pathname,
      headers,
    };

    https
      .get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error(`GitHub API Error ${res.statusCode}: ${parsed.message || data}`));
              return;
            }
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchIssues() {
  const issues = [];
  let page = 1;

  while (true) {
    const batch = await requestJson(`/repos/${OWNER}/${REPO}/issues?state=open&per_page=${PER_PAGE}&page=${page}`);
    issues.push(...batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
  }

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      labels: (issue.labels || []).map((label) => ({
        id: label.id,
        name: label.name,
        color: label.color,
      })),
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function main() {
  const issues = await fetchIssues();
  fs.mkdirSync(path.dirname(PUBLIC_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_PATH, `${JSON.stringify(issues, null, 2)}\n`);
  console.log(`Wrote ${issues.length} issues to ${PUBLIC_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
