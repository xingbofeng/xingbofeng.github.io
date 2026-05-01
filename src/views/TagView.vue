<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { PAGE_SIZE, buildTagStats, filterPosts, formatDate, paginate, sortPosts } from '../lib/blog';
import { useIssues, loadIssues } from '../composables/useIssues';

const route = useRoute();
const router = useRouter();
const { issues, loading, error } = useIssues();

const tagSlug = computed(() => String(route.params.slug || ''));
const pageSize = PAGE_SIZE;
const posts = computed(() => sortPosts(filterPosts(issues.value, { tag: tagSlug.value })));
const tag = computed(() => buildTagStats(issues.value).find((item) => item.slug === tagSlug.value));
const page = computed(() => paginate(posts.value, Number(route.query.page || 1), pageSize));
const emptyState = computed(() => !loading.value && !error.value && page.value.total === 0);

function onPageChange(nextPage) {
  router.replace({ query: { ...route.query, page: String(nextPage) } });
}

onMounted(loadIssues);
</script>

<template>
  <div class="page page-tag">
    <section class="hero hero--compact glass-card">
      <div class="hero__copy">
        <p class="eyebrow">Tag / 标签</p>
        <h1>{{ tag?.name || tagSlug }}</h1>
        <p class="hero__lead">围绕这个主题的全部文章。</p>
      </div>
      <div class="hero__panel">
        <div class="metric-grid metric-grid--compact">
          <article class="metric">
            <span>{{ tag?.count || 0 }}</span>
            <p>Posts / 文章</p>
          </article>
          <article class="metric">
            <span>{{ page.totalPages }}</span>
            <p>Pages / 页数</p>
          </article>
        </div>
      </div>
    </section>

    <div v-if="loading" class="state-card glass-card">Loading tag archive / 正在加载...</div>
    <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
    <div v-else-if="emptyState" class="state-card glass-card">
      No posts matched / 没有找到符合这个标签的文章。<br />
      <RouterLink to="/tags" class="read-more">Back to tags / 返回标签页</RouterLink>
    </div>
    <section v-else class="archive">
      <div class="archive-list">
        <article v-for="post in page.items" :key="post.number" class="archive-list__item">
          <div class="archive-list__meta">
            <span class="archive-list__date">{{ formatDate(post.createdAt) }}</span>
            <span class="archive-list__reading">{{ post.readingTime }} min</span>
          </div>

          <div class="archive-list__body">
            <RouterLink :to="`/article/${post.number}`" class="archive-list__title">{{ post.title }}</RouterLink>
            <p class="archive-list__excerpt">{{ post.excerpt }}</p>
          </div>

          <div class="archive-list__side">
            <RouterLink :to="`/article/${post.number}`" class="read-more archive-list__read">Read / 阅读</RouterLink>
          </div>
        </article>
      </div>

      <div v-if="page.totalPages > 1" class="pagination glass-card">
        <button class="page-button" :disabled="page.currentPage === 1" @click="onPageChange(page.currentPage - 1)">Prev / 上一页</button>
        <div class="pagination__pages">
          <button
            v-for="n in page.totalPages"
            :key="n"
            class="page-dot"
            :class="{ 'page-dot--active': n === page.currentPage }"
            @click="onPageChange(n)"
          >
            {{ n }}
          </button>
        </div>
        <button class="page-button" :disabled="page.currentPage === page.totalPages" @click="onPageChange(page.currentPage + 1)">Next / 下一页</button>
      </div>
    </section>
  </div>
</template>
