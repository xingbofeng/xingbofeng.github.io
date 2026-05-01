<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { PAGE_SIZE, buildTagStats, filterPosts, formatDate, paginate } from '../lib/blog';
import { profile } from '../content/profile';
import { useIssues, loadIssues } from '../composables/useIssues';

const route = useRoute();
const router = useRouter();
const { issues, loading, error, featuredIssues, latestIssue } = useIssues();

const search = ref(String(route.query.q || ''));
const tag = ref(String(route.query.tag || ''));
const from = ref(String(route.query.from || ''));
const to = ref(String(route.query.to || ''));
const page = ref(Number(route.query.page || 1));
const range = ref(String(route.query.range || 'all'));

const pageSize = PAGE_SIZE;

const quickRanges = [
  { key: 'all', labelEn: 'All time', labelZh: '全部' },
  { key: 'year', labelEn: 'This year', labelZh: '今年' },
  { key: '90d', labelEn: '90 days', labelZh: '90 天' },
  { key: '30d', labelEn: '30 days', labelZh: '30 天' },
  { key: '7d', labelEn: '7 days', labelZh: '7 天' },
];

function setQuickRange(key) {
  range.value = key;
  const today = new Date();
  const date = (days) => {
    const copy = new Date(today);
    copy.setDate(copy.getDate() - days);
    return copy.toISOString().slice(0, 10);
  };

  if (key === 'all') {
    from.value = '';
    to.value = '';
  } else if (key === 'year') {
    from.value = `${today.getFullYear()}-01-01`;
    to.value = today.toISOString().slice(0, 10);
  } else if (key === '90d') {
    from.value = date(90);
    to.value = today.toISOString().slice(0, 10);
  } else if (key === '30d') {
    from.value = date(30);
    to.value = today.toISOString().slice(0, 10);
  } else if (key === '7d') {
    from.value = date(7);
    to.value = today.toISOString().slice(0, 10);
  }
  page.value = 1;
}

function syncQuery() {
  const query = {};
  if (search.value) query.q = search.value;
  if (tag.value) query.tag = tag.value;
  if (from.value) query.from = from.value;
  if (to.value) query.to = to.value;
  if (range.value && range.value !== 'all') query.range = range.value;
  if (page.value > 1) query.page = String(page.value);

  const sameQuery =
    String(route.query.q || '') === String(query.q || '') &&
    String(route.query.tag || '') === String(query.tag || '') &&
    String(route.query.from || '') === String(query.from || '') &&
    String(route.query.to || '') === String(query.to || '') &&
    String(route.query.range || 'all') === String(query.range || 'all') &&
    String(route.query.page || '1') === String(query.page || '1');

  if (!sameQuery) {
    router.replace({ query });
  }
}

watch([search, tag, from, to, range, page], syncQuery);

watch(
  () => route.query,
  (query) => {
    search.value = String(query.q || '');
    tag.value = String(query.tag || '');
    from.value = String(query.from || '');
    to.value = String(query.to || '');
    range.value = String(query.range || 'all');
    page.value = Number(query.page || 1);
  },
  { immediate: true },
);

const visiblePosts = computed(() => filterPosts(issues.value, { search: search.value, tag: tag.value, from: from.value, to: to.value }));
const paginated = computed(() => paginate(visiblePosts.value, page.value, pageSize));
const tagStats = computed(() => buildTagStats(issues.value));
const totalPosts = computed(() => issues.value.length);
const totalTags = computed(() => tagStats.value.length);
const totalYears = computed(() => new Set(issues.value.map((post) => new Date(post.createdAt).getFullYear())).size);
const latestDate = computed(() => (latestIssue.value ? formatDate(latestIssue.value.createdAt) : ''));
const featured = computed(() => featuredIssues.value.filter((post) => visiblePosts.value.some((item) => item.number === post.number)));
const emptyResults = computed(() => !loading.value && !error.value && paginated.value.total === 0);

function resetFilters() {
  search.value = '';
  tag.value = '';
  from.value = '';
  to.value = '';
  range.value = 'all';
  page.value = 1;
}

function pickTag(label) {
  tag.value = label.slug;
  page.value = 1;
}

function onPageChange(nextPage) {
  page.value = nextPage;
}

onMounted(loadIssues);
</script>

<template>
  <div class="page page-home">
    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow">Counter 的技术分享 / Technical Notebook</p>
        <h1>AI Agent、复杂视觉工程与全栈产品思考</h1>
        <p class="hero__lead">
          这里记录我在 Agentic Coding、上下文工程、医学影像、图像/视频处理、无限画布、前端可视化、数据平台与开发者体验上的长期思考。
        </p>
        <div class="hero__actions">
          <RouterLink to="/about" class="button button--primary">About / 关于我</RouterLink>
          <RouterLink to="/tags" class="button button--secondary">Tags / 标签</RouterLink>
        </div>
      </div>
      <div class="hero__panel glass-card">
        <div class="metric-grid">
          <article class="metric">
            <span>{{ totalPosts }}</span>
            <p>Published posts / 文章</p>
          </article>
          <article class="metric">
            <span>{{ totalTags }}</span>
            <p>Topics / 标签</p>
          </article>
          <article class="metric">
            <span>{{ totalYears }}</span>
            <p>Writing years / 写作跨度</p>
          </article>
          <article class="metric">
            <span>{{ latestDate || '—' }}</span>
            <p>Latest post / 最新文章</p>
          </article>
        </div>
      </div>
    </section>

    <section class="page-grid page-grid--featured">
      <article v-for="post in featured" :key="post.number" class="feature-card glass-card">
        <div class="feature-card__meta">
          <span>{{ formatDate(post.createdAt) }}</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
        <RouterLink :to="`/article/${post.number}`" class="feature-card__title">{{ post.title }}</RouterLink>
        <p class="feature-card__excerpt">{{ post.excerpt }}</p>
        <div class="tag-row">
          <RouterLink
            v-for="label in post.labels.slice(0, 3)"
            :key="label.id"
            :to="`/tag/${label.slug}`"
            class="tag-chip"
            :style="{ '--chip-color': `#${label.color}` }"
          >
            {{ label.name }}
          </RouterLink>
        </div>
      </article>
    </section>

    <section class="filters glass-card">
      <div class="filters__top">
        <div>
          <p class="section-kicker">Browse / 浏览</p>
          <h2>Search, filter, and page through the issue-powered archive.</h2>
        </div>
        <button class="button button--ghost" @click="resetFilters">Reset / 重置</button>
      </div>

      <div class="filter-bar">
        <label class="search-box">
          <span>Search / 搜索</span>
          <input v-model="search" type="search" placeholder="文章标题、正文或标签" />
        </label>

        <label class="search-box">
          <span>From / 起始</span>
          <input v-model="from" type="date" />
        </label>

        <label class="search-box">
          <span>To / 结束</span>
          <input v-model="to" type="date" />
        </label>
      </div>

      <div class="range-row">
        <button
          v-for="item in quickRanges"
          :key="item.key"
          class="pill-button"
          :class="{ 'pill-button--active': range === item.key }"
          @click="setQuickRange(item.key)"
        >
          {{ item.labelEn }} / {{ item.labelZh }}
        </button>
      </div>

      <div class="tag-cloud">
        <button
          v-for="stat in tagStats.slice(0, 12)"
          :key="stat.slug"
          class="tag-pill"
          :class="{ 'tag-pill--active': tag === stat.slug }"
          :style="{ '--chip-color': `#${stat.color}` }"
          @click="pickTag(stat)"
        >
          {{ stat.name }} <span>{{ stat.count }}</span>
        </button>
      </div>
    </section>

    <section class="archive">
      <div class="archive__head">
        <div>
          <p class="section-kicker">Archive / 文章列表</p>
          <h2>{{ paginated.total }} posts matched</h2>
        </div>
        <div class="archive__hint">
          <span>Page {{ paginated.currentPage }} / {{ paginated.totalPages }}</span>
        </div>
      </div>

      <div v-if="loading" class="state-card glass-card">Loading posts / 正在加载文章...</div>
      <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
      <div v-else-if="emptyResults" class="state-card glass-card">No posts matched / 没有找到符合条件的文章。<br />试试清空筛选条件或切换标签。</div>
      <div v-else>
        <div class="archive-list">
          <article v-for="post in paginated.items" :key="post.number" class="archive-list__item">
            <div class="archive-list__meta">
              <span class="archive-list__date">{{ formatDate(post.createdAt) }}</span>
              <span class="archive-list__reading">{{ post.readingTime }} min</span>
            </div>

            <div class="archive-list__body">
              <RouterLink :to="`/article/${post.number}`" class="archive-list__title">{{ post.title }}</RouterLink>
              <p class="archive-list__excerpt">{{ post.excerpt }}</p>
            </div>

            <div class="archive-list__side">
              <div class="tag-row archive-list__tags">
                <RouterLink
                  v-for="label in post.labels.slice(0, 3)"
                  :key="label.id"
                  :to="`/tag/${label.slug}`"
                  class="tag-chip tag-chip--soft"
                  :style="{ '--chip-color': `#${label.color}` }"
                >
                  {{ label.name }}
                </RouterLink>
              </div>
              <RouterLink :to="`/article/${post.number}`" class="read-more archive-list__read">Read / 阅读</RouterLink>
            </div>
          </article>
        </div>

        <div v-if="paginated.totalPages > 1" class="pagination glass-card">
          <button class="page-button" :disabled="paginated.currentPage === 1" @click="onPageChange(paginated.currentPage - 1)">Prev / 上一页</button>
          <div class="pagination__pages">
            <button
              v-for="n in paginated.totalPages"
              :key="n"
              class="page-dot"
              :class="{ 'page-dot--active': n === paginated.currentPage }"
              @click="onPageChange(n)"
            >
              {{ n }}
            </button>
          </div>
          <button class="page-button" :disabled="paginated.currentPage === paginated.totalPages" @click="onPageChange(paginated.currentPage + 1)">Next / 下一页</button>
        </div>
      </div>
    </section>
  </div>
</template>
