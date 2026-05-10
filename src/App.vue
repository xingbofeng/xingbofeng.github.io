<script setup>
const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/xingbofeng',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/github.svg',
    color: '#181717',
    title: 'GitHub / GitHub',
  },
  {
    label: 'Xiaohongshu',
    href: 'https://www.xiaohongshu.com/user/profile/5fe3215600000000010032bb',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/xiaohongshu.svg',
    color: '#ff2442',
    title: '小红书',
  },
  {
    label: 'Bilibili',
    href: 'https://space.bilibili.com/31193282',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/bilibili.svg',
    color: '#00a1d6',
    title: 'Bilibili',
  },
  {
    label: 'Zhihu',
    href: 'https://www.zhihu.com/column/encounter',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/zhihu.svg',
    color: '#056de8',
    title: '知乎',
  },
];
</script>

<template>
  <div class="app-shell">
    <div class="app-backdrop app-backdrop-a"></div>
    <div class="app-backdrop app-backdrop-b"></div>
    <div class="app-grid"></div>

    <header class="topbar">
      <div class="topbar__inner">
        <RouterLink to="/" class="brand">
          <img class="brand__avatar" src="https://avatars.githubusercontent.com/xingbofeng" alt="Counterxing avatar" />
          <span class="brand__copy">
            <strong>Counterxing</strong>
            <small>Full-stack Agent Architecture · Product Thinking</small>
          </span>
        </RouterLink>

        <nav class="topnav">
          <RouterLink to="/" class="topnav__link">Home / 首页</RouterLink>
          <RouterLink to="/about" class="topnav__link">Project / 项目</RouterLink>
          <RouterLink to="/articles" class="topnav__link">Articles / 文章</RouterLink>
        </nav>
        <div class="social-links" aria-label="social links">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
            class="social-links__item"
            :title="link.title"
            :style="{ '--social-color': link.color, '--social-icon': `url(${link.icon})` }"
          >
            <span class="social-links__icon" aria-hidden="true"></span>
            <span class="sr-only">{{ link.label }}</span>
          </a>
        </div>
      </div>
    </header>

    <main class="page-shell">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div>
          <strong>Counterxing</strong>
          <p>AI Agent systems, visual frontend engineering, and independent product notes.</p>
        </div>
        <div class="site-footer__meta">
          <span>Writing Archive</span>
          <span>Vue 3 + Vite</span>
          <span>Real writing archive</span>
        </div>
      </div>
    </footer>
  </div>
</template>
