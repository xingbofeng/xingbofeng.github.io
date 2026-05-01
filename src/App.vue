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
            <strong>Counterxing Blog</strong>
            <small>AI Agent · 视觉前端工程 · 全栈产品思考</small>
          </span>
        </RouterLink>

        <nav class="topnav">
          <RouterLink to="/" class="topnav__link">Home / 首页</RouterLink>
          <RouterLink to="/about" class="topnav__link">About / 关于</RouterLink>
          <RouterLink to="/tags" class="topnav__link">Tags / 标签</RouterLink>
          <a class="topnav__link topnav__link--ghost" href="https://github.com/xingbofeng" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
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
          <strong>Counterxing Blog</strong>
          <p>Built with Vue 3, GitHub Issues, and a deliberately high bar for visual systems.</p>
        </div>
        <div class="site-footer__meta">
          <span>GitHub Issues as CMS</span>
          <span>Hash Routing</span>
          <span>GitHub Pages Ready</span>
        </div>
      </div>
    </footer>
  </div>
</template>

