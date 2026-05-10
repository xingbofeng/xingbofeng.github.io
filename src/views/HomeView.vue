<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { buildTagStats, formatDate } from '../lib/blog';
import { profile } from '../content/profile';
import { useIssues, loadIssues } from '../composables/useIssues';

const { issues, loading, error, featuredIssues, latestIssue } = useIssues();

const tagStats = computed(() => buildTagStats(issues.value));
const totalPosts = computed(() => issues.value.length);
const totalTags = computed(() => tagStats.value.length);
const latestDate = computed(() => (latestIssue.value ? formatDate(latestIssue.value.createdAt) : ''));
const featured = computed(() => featuredIssues.value);
const focusAreas = computed(() => profile.focusAreas);
const projects = computed(() => profile.projects);
const heroProofs = computed(() => [
  { value: '2018-2024', label: '腾讯 · 前端架构师' },
  { value: '2024-2026', label: '大疆 · 全栈架构师' },
  { value: 'Now', label: 'AI Agent · 产品架构 · 独立开发' },
]);

onMounted(loadIssues);
</script>

<template>
  <div class="page page-home">
    <section class="hero hero--home">
      <div class="hero__copy">
        <div class="hero__mark" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1>counterxing</h1>
        <p class="hero__lead">
          把 AI Agent、全栈架构和产品思考连接起来，做能真实进入工作流的智能体系统和创作工具。
        </p>
        <div class="answer-grid">
          <article>
            <span>Who</span>
            <strong>全栈产品架构 / 产品级工程</strong>
            <p>从用户体验到系统交付，专注 AI Agent、产品化流程与可持续工程架构。</p>
          </article>
          <article>
            <span>Now</span>
            <strong>AI Agent</strong>
            <p>关注智能体架构、上下文工程、工具编排和真实工作流。</p>
          </article>
          <article>
            <span>Why</span>
            <strong>产品思考</strong>
            <p>把工程能力、多模态视频/图像处理和创作体验连接起来。</p>
          </article>
        </div>
        <div class="hero__actions">
          <RouterLink to="/about" class="button button--primary">项目 / Project</RouterLink>
          <RouterLink to="/articles" class="button button--secondary">文章 / Articles</RouterLink>
        </div>
        <a class="scroll-cue" href="#project">
          <span></span>
          Scroll / 下滑
        </a>
      </div>
      <div class="hero__panel profile-panel">
        <div class="profile-panel__beam" aria-hidden="true"></div>
        <img class="profile-panel__avatar" src="https://avatars.githubusercontent.com/xingbofeng" alt="Counterxing avatar" />
        <div>
          <p>Experience</p>
          <h2>{{ profile.titleEn }}</h2>
          <span>{{ profile.titleZh }}</span>
        </div>
        <div class="proof-list">
          <article v-for="item in heroProofs" :key="item.label">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="landing-section focus-section">
      <div class="section-heading section-heading--split">
        <div>
          <p class="section-kicker">Focus / 当前关注</p>
          <h2>围绕智能体，把架构、工程和产品连接起来。</h2>
        </div>
        <p>重点放在 AI Agent、智能体架构、全栈架构、产品思考，以及多模态视频/图像处理。</p>
      </div>
      <div class="focus-grid">
        <article v-for="area in focusAreas" :key="area.enTitle" class="focus-card glass-card">
          <span>{{ area.enTitle }}</span>
          <h3>{{ area.zhTitle }}</h3>
          <p>{{ area.zh }}</p>
        </article>
      </div>
    </section>

    <section id="project" class="landing-section landing-section--project projects-preview">
      <div class="project-row">
        <a v-for="project in projects" :key="project.href" :href="project.href" target="_blank" rel="noreferrer" class="project-card glass-card">
          <span>Dreamweaver Picturebook</span>
          <h3>dreamweaver-picturebook</h3>
          <small class="project-card__subtitle">绘梦工坊 · AI 儿童绘本创作工作台</small>
          <p>{{ project.zh }}</p>
        </a>
      </div>
    </section>

    <section class="landing-section evidence-section">
      <div class="section-heading section-heading--split">
        <div>
          <p class="section-kicker">Latest Articles / 最新文章</p>
          <h2>最新文章</h2>
        </div>
        <div class="mini-metrics">
          <article>
            <strong>{{ totalPosts }}</strong>
            <span>posts</span>
          </article>
          <article>
            <strong>{{ totalTags }}</strong>
            <span>topics</span>
          </article>
          <article>
            <strong>{{ latestDate || '—' }}</strong>
            <span>latest</span>
          </article>
        </div>
        <RouterLink to="/articles" class="button button--ghost">全部文章 / Archive</RouterLink>
      </div>

      <div v-if="loading" class="state-card glass-card">Loading posts / 正在加载文章...</div>
      <div v-else-if="error" class="state-card glass-card state-card--error">{{ error }}</div>
      <div v-else class="page-grid page-grid--featured">
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
      </div>
    </section>
  </div>
</template>
