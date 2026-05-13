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
        <span>{{ project.kicker }}</span>
        <h3>{{ project.nameEn }}</h3>
        <p>{{ project.zh }}</p>
        <small>{{ project.href }}</small>
      </a>
    </section>
  </div>
</template>
