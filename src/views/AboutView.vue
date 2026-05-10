<script setup>
import { profile } from '../content/profile';

const projects = profile.projects;
</script>

<template>
  <div class="page page-about">
    <section class="projects-section about-project-first">
      <a
        v-for="project in projects"
        :key="project.href"
        :href="project.href"
        target="_blank"
        rel="noreferrer"
        class="project-card project-card--featured glass-card"
      >
        <span>GitHub / xingbofeng</span>
        <h3>{{ project.nameEn }}</h3>
        <p>绘梦工坊：生成一本可编辑、可预览、可导出的 AI 儿童绘本。</p>
        <small>{{ project.href }}</small>
      </a>
    </section>
  </div>
</template>
