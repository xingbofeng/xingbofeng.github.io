import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import TagsView from './views/TagsView.vue';
import TagView from './views/TagView.vue';
import ArticleView from './views/ArticleView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Counterxing Blog' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'About | Counterxing Blog' } },
    { path: '/tags', name: 'tags', component: TagsView, meta: { title: 'Tags | Counterxing Blog' } },
    { path: '/tag/:slug', name: 'tag', component: TagView, meta: { title: 'Tag | Counterxing Blog' } },
    { path: '/article/:number', name: 'article', component: ArticleView, meta: { title: 'Article | Counterxing Blog' } },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 };
  },
});

router.afterEach((to) => {
  const title = to.meta?.title ? `${to.meta.title}` : 'Counterxing Blog';
  document.title = title;
});

export default router;
