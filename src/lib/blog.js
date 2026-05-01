export const PAGE_SIZE = 9;
const BROKEN_TEXT_RE = /\uFFFD+/g;
const HAS_BROKEN_TEXT_RE = /\uFFFD/;
const RETIRED_LABELS = new Set(['JavaScript', 'Redux', '代码规范', '敏捷开发', '自译']);

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(dateString, locale = 'zh-CN') {
  if (!dateString) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatISODate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().slice(0, 10);
}

export function buildArticleHref(number) {
  return `/#/article/${number}`;
}

export function estimateReadingTime(body = '') {
  const words = cleanContent(body).replace(/[`*_>#\-]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function cleanContent(value = '') {
  return String(value).replace(BROKEN_TEXT_RE, '');
}

export function excerpt(body = '', limit = 160) {
  const clean = cleanContent(body)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[(.*?)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > limit ? `${clean.slice(0, limit)}...` : clean;
}

export function normalizeIssue(issue) {
  const labels = Array.isArray(issue.labels)
    ? issue.labels
        .filter((label) => !HAS_BROKEN_TEXT_RE.test(label.name || '') && !RETIRED_LABELS.has(label.name))
        .map((label) => {
          const name = cleanContent(label.name);
          return {
            id: label.id,
            name,
            color: label.color,
            slug: slugify(name),
          };
        })
    : [];

  const createdAt = issue.created_at || issue.createdAt;
  const updatedAt = issue.updated_at || issue.updatedAt;
  const body = cleanContent(issue.body || '');

  return {
    id: issue.id,
    number: issue.number,
    title: issue.title || '',
    body,
    labels,
    createdAt,
    updatedAt,
    htmlUrl: issue.html_url || issue.htmlUrl || '',
    slug: String(issue.number),
    excerpt: excerpt(body),
    readingTime: estimateReadingTime(body),
    imageCount: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length,
  };
}

export function sortPosts(posts = []) {
  return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function filterPosts(posts = [], { search = '', tag = '', from = '', to = '' } = {}) {
  const query = search.trim().toLowerCase();
  const start = from ? new Date(`${from}T00:00:00`) : null;
  const end = to ? new Date(`${to}T23:59:59`) : null;

  return posts.filter((post) => {
    const createdAt = new Date(post.createdAt);
    const matchesTag = !tag || post.labels.some((label) => label.slug === tag || slugify(label.name) === tag);
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.labels.some((label) => label.name.toLowerCase().includes(query));
    const matchesFrom = !start || createdAt >= start;
    const matchesTo = !end || createdAt <= end;
    return matchesTag && matchesSearch && matchesFrom && matchesTo;
  });
}

export function paginate(items = [], page = 1, pageSize = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  return {
    currentPage,
    totalPages,
    total,
    items: items.slice(start, start + pageSize),
  };
}

export function buildTagStats(posts = []) {
  const map = new Map();
  posts.forEach((post) => {
    post.labels.forEach((label) => {
      const current = map.get(label.slug) || {
        slug: label.slug,
        name: label.name,
        color: label.color,
        count: 0,
        latest: post.createdAt,
      };
      current.count += 1;
      if (new Date(post.createdAt) > new Date(current.latest)) {
        current.latest = post.createdAt;
      }
      map.set(label.slug, current);
    });
  });
  return [...map.values()].sort((a, b) => b.count - a.count || new Date(b.latest) - new Date(a.latest));
}

export function buildYearStats(posts = []) {
  const map = new Map();
  posts.forEach((post) => {
    const year = new Date(post.createdAt).getFullYear();
    map.set(year, (map.get(year) || 0) + 1);
  });
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({ year, count }));
}

export function buildArchive(posts = []) {
  const archive = new Map();
  posts.forEach((post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!archive.has(year)) archive.set(year, []);
    archive.get(year).push(post);
  });
  return [...archive.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, items }));
}

export function getNeighbors(posts = [], currentNumber) {
  const sorted = sortPosts(posts);
  const index = sorted.findIndex((post) => post.number === Number(currentNumber));
  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
