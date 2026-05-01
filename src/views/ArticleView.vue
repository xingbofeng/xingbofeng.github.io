<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { formatDate, getNeighbors } from '../lib/blog';
import { useIssues, loadIssues } from '../composables/useIssues';

const route = useRoute();
const { issues, loading, error } = useIssues();

marked.setOptions({ breaks: true, gfm: true });

const post = computed(() => issues.value.find((item) => String(item.number) === String(route.params.number)) || null);
const neighbors = computed(() => getNeighbors(issues.value, route.params.number));
const articleHtml = computed(() => DOMPurify.sanitize(marked.parse(post.value?.body || '')));

onMounted(loadIssues);
</script>

<template>
  <div class="page page-article">
    <div v-if="loading" class="state-card glass-card">Loading article / 正在加载文章...</div>
    <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
    <template v-else-if="post">
      <section class="article-hero glass-card">
        <RouterLink to="/" class="back-link">← Back / 返回首页</RouterLink>
        <div class="article-hero__top">
          <div>
            <p class="eyebrow">Article / 文章</p>
            <h1>{{ post.title }}</h1>
          </div>
          <div class="article-meta">
            <span>{{ formatDate(post.createdAt) }}</span>
            <span>{{ post.readingTime }} min read</span>
            <span>{{ post.labels.length }} tags</span>
          </div>
        </div>
      </section>

      <div class="article-layout">
        <aside class="article-aside glass-card">
          <p class="section-kicker">Metadata / 元信息</p>
          <dl>
            <div>
              <dt>Date / 日期</dt>
              <dd>{{ formatDate(post.createdAt) }}</dd>
            </div>
            <div>
              <dt>Reading / 阅读</dt>
              <dd>{{ post.readingTime }} min</dd>
            </div>
            <div>
              <dt>Comments / 评论</dt>
              <dd>{{ post.comments || 0 }}</dd>
            </div>
          </dl>
          <div class="tag-stack">
            <RouterLink v-for="label in post.labels" :key="label.id" :to="`/tag/${label.slug}`" class="tag-chip" :style="{ '--chip-color': `#${label.color}` }">
              {{ label.name }}
            </RouterLink>
          </div>
          <a class="button button--secondary button--block" :href="post.htmlUrl" target="_blank" rel="noreferrer">Open in GitHub</a>
        </aside>

        <article class="article-body glass-card">
          <div class="markdown-body" v-html="articleHtml"></div>
        </article>
      </div>

      <section class="neighbor-nav">
        <RouterLink v-if="neighbors.previous" :to="`/article/${neighbors.previous.number}`" class="neighbor-card glass-card">
          <span>Previous / 上一篇</span>
          <strong>{{ neighbors.previous.title }}</strong>
        </RouterLink>
        <div v-else class="neighbor-card ghost-card glass-card"></div>
        <RouterLink v-if="neighbors.next" :to="`/article/${neighbors.next.number}`" class="neighbor-card glass-card neighbor-card--align-right">
          <span>Next / 下一篇</span>
          <strong>{{ neighbors.next.title }}</strong>
        </RouterLink>
        <div v-else class="neighbor-card ghost-card glass-card"></div>
      </section>
    </template>

    <div v-else class="state-card glass-card state-card--error">Article not found / 文章不存在</div>
  </div>
</template>
