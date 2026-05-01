<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { buildTagStats } from '../lib/blog';
import { useIssues, loadIssues } from '../composables/useIssues';

const { issues, loading, error } = useIssues();
const tags = computed(() => buildTagStats(issues.value));

onMounted(loadIssues);
</script>

<template>
  <div class="page page-tags">
    <section class="hero hero--compact glass-card">
      <div class="hero__copy">
        <p class="eyebrow">Tags / 标签</p>
        <h1>Tag the archive by ideas, not only by time.</h1>
        <p class="hero__lead">按主题而不是只按时间浏览这座博客档案。</p>
      </div>
      <div class="hero__panel">
        <div class="metric-grid metric-grid--compact">
          <article class="metric">
            <span>{{ tags.length }}</span>
            <p>Active tags / 标签</p>
          </article>
          <article class="metric">
            <span>{{ issues.length }}</span>
            <p>Total posts / 文章总数</p>
          </article>
        </div>
      </div>
    </section>

    <div v-if="loading" class="state-card glass-card">Loading tags / 正在加载标签...</div>
    <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
    <section v-else class="tag-board">
      <RouterLink v-for="tag in tags" :key="tag.slug" :to="`/tag/${tag.slug}`" class="tag-card glass-card">
        <div class="tag-card__title">
          <h3>{{ tag.name }}</h3>
          <span>{{ tag.count }}</span>
        </div>
        <p>Latest / 最新: {{ tag.latest.slice(0, 10) }}</p>
        <div class="tag-card__bar" :style="{ '--chip-color': `#${tag.color}` }"></div>
      </RouterLink>
    </section>
  </div>
</template>
