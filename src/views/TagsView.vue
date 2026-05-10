<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { PAGE_SIZE, buildTagStats, formatDate, paginate } from '../lib/blog';
import { useIssues, loadIssues } from '../composables/useIssues';

const route = useRoute();
const router = useRouter();
const { issues, loading, error } = useIssues();

const selectedTag = ref(String(route.query.tag || ''));
const page = ref(Number(route.query.page || 1));

const tags = computed(() => buildTagStats(issues.value));
const filteredPosts = computed(() => {
  if (!selectedTag.value) return issues.value;
  return issues.value.filter((post) => post.labels.some((label) => label.slug === selectedTag.value));
});
const paginated = computed(() => paginate(filteredPosts.value, page.value, PAGE_SIZE));
const activeTag = computed(() => tags.value.find((tag) => tag.slug === selectedTag.value));

function selectTag(slug) {
  selectedTag.value = slug;
  page.value = 1;
}

function onPageChange(nextPage) {
  page.value = nextPage;
}

watch(
  () => route.query,
  (query) => {
    selectedTag.value = String(query.tag || '');
    page.value = Number(query.page || 1);
  },
  { immediate: true },
);

watch([selectedTag, page], () => {
  const query = {};
  if (selectedTag.value) query.tag = selectedTag.value;
  if (page.value > 1) query.page = String(page.value);

  const sameQuery =
    String(route.query.tag || '') === String(query.tag || '') &&
    String(route.query.page || '1') === String(query.page || '1');

  if (!sameQuery) {
    router.replace({ query });
  }
});

onMounted(loadIssues);
</script>

<template>
  <div class="page page-tags">
    <section class="hero hero--compact glass-card">
      <div class="hero__copy">
        <p class="eyebrow">Articles / 文章</p>
        <h1>文章列表</h1>
        <p class="hero__lead">上方按标签筛选，下方浏览对应博文。</p>
      </div>
      <div class="hero__panel">
        <div class="metric-grid metric-grid--compact">
          <article class="metric">
            <span>{{ issues.length }}</span>
            <p>Total posts / 文章</p>
          </article>
          <article class="metric">
            <span>{{ tags.length }}</span>
            <p>Tags / 标签</p>
          </article>
        </div>
      </div>
    </section>

    <section class="filters glass-card">
      <div class="filters__top">
        <div>
          <p class="section-kicker">Tags / 标签筛选</p>
          <h2>{{ activeTag ? activeTag.name : '全部文章' }}</h2>
        </div>
        <button class="button button--ghost" :disabled="!selectedTag" @click="selectTag('')">全部 / All</button>
      </div>

      <div v-if="loading" class="state-card glass-card">Loading posts / 正在加载文章...</div>
      <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
      <div v-else class="tag-cloud">
        <button
          v-for="tag in tags"
          :key="tag.slug"
          class="tag-pill"
          :class="{ 'tag-pill--active': selectedTag === tag.slug }"
          :style="{ '--chip-color': `#${tag.color}` }"
          @click="selectTag(tag.slug)"
        >
          {{ tag.name }} <span>{{ tag.count }}</span>
        </button>
      </div>
    </section>

    <section class="archive">
      <div class="archive__head">
        <div>
          <p class="section-kicker">Posts / 博文列表</p>
          <h2>共 {{ paginated.total }} 篇文章</h2>
        </div>
        <div class="archive__hint">
          <span>Page {{ paginated.currentPage }} / {{ paginated.totalPages }}</span>
        </div>
      </div>

      <div v-if="loading" class="state-card glass-card">Loading posts / 正在加载文章...</div>
      <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
      <div v-else-if="paginated.total === 0" class="state-card glass-card">没有找到对应标签的文章。</div>
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
                <button
                  v-for="label in post.labels.slice(0, 3)"
                  :key="label.id"
                  class="tag-chip tag-chip--soft tag-chip--button"
                  :style="{ '--chip-color': `#${label.color}` }"
                  @click="selectTag(label.slug)"
                >
                  {{ label.name }}
                </button>
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
