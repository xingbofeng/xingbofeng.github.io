import { computed, ref } from 'vue';
import { normalizeIssue, sortPosts } from '../lib/blog';

const issues = ref([]);
const loading = ref(true);
const error = ref('');
let loadPromise = null;

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
}

async function fetchFromGithubApi() {
  const owner = 'xingbofeng';
  const repo = 'xingbofeng.github.io';
  const perPage = 100;
  let page = 1;
  const all = [];

  while (true) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=${perPage}&page=${page}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const batch = await response.json();
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return all;
}

export async function loadIssues() {
  if (issues.value.length > 0) return issues.value;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    loading.value = true;
    error.value = '';

    try {
      let raw;
      try {
        raw = await fetchJson('/issues.json');
      } catch {
        raw = await fetchFromGithubApi();
      }

      issues.value = sortPosts(
        raw
          .filter((issue) => !issue.pull_request)
          .map(normalizeIssue),
      );
      return issues.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load blog posts.';
      throw err;
    } finally {
      loading.value = false;
      loadPromise = null;
    }
  })();

  return loadPromise;
}

export function useIssues() {
  return {
    issues,
    loading,
    error,
    loadIssues,
    hasIssues: computed(() => issues.value.length > 0),
    featuredIssues: computed(() => issues.value.slice(0, 3)),
    latestIssue: computed(() => issues.value[0] || null),
  };
}
