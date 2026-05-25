import { useEffect, useMemo, useState } from 'react';
import { HashRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Button, Card, Cursor, Divider, Phone, Typewriter } from 'animal-island-ui';
import { profile } from './content/profile';
import { buildTagStats, filterPosts, formatDate, getNeighbors, normalizeIssue, paginate, sortPosts } from './lib/blog';

const issueStore = {
  issues: [],
  promise: null,
};

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/xingbofeng',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/github.svg',
    color: '#181717',
  },
  {
    label: 'Xiaohongshu',
    href: 'https://www.xiaohongshu.com/user/profile/5fe3215600000000010032bb',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/xiaohongshu.svg',
    color: '#ff2442',
  },
  {
    label: 'Bilibili',
    href: 'https://space.bilibili.com/31193282',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/bilibili.svg',
    color: '#00a1d6',
  },
  {
    label: 'Zhihu',
    href: 'https://www.zhihu.com/column/encounter',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/zhihu.svg',
    color: '#2f6fed',
  },
];

const cardColors = ['app-yellow', 'app-teal', 'app-pink', 'app-blue', 'app-green', 'app-orange', 'yellow-green', 'brown'];

marked.setOptions({ breaks: true, gfm: true });

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
}

async function fetchIssuesFromGithub() {
  const owner = 'xingbofeng';
  const repo = 'xingbofeng.github.io';
  const perPage = 100;
  const all = [];

  for (let page = 1; ; page += 1) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=${perPage}&page=${page}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const batch = await response.json();
    all.push(...batch);
    if (batch.length < perPage) break;
  }

  return all;
}

async function loadIssues() {
  if (issueStore.issues.length) return issueStore.issues;
  if (issueStore.promise) return issueStore.promise;

  issueStore.promise = (async () => {
    let raw;
    try {
      raw = await fetchJson('/issues.json');
    } catch {
      raw = await fetchIssuesFromGithub();
    }

    issueStore.issues = sortPosts(raw.filter((issue) => !issue.pull_request).map(normalizeIssue));
    issueStore.promise = null;
    return issueStore.issues;
  })();

  return issueStore.promise;
}

function usePosts() {
  const [issues, setIssues] = useState(issueStore.issues);
  const [loading, setLoading] = useState(!issueStore.issues.length);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(!issueStore.issues.length);
    loadIssues()
      .then((items) => {
        if (!cancelled) {
          setIssues(items);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load posts.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { issues, loading, error };
}

function Header() {
  return (
    <header className="blog-header">
      <Link to="/" className="blog-header-brand">
        <img className="blog-logo-avatar" src="https://avatars.githubusercontent.com/xingbofeng" alt="Counterxing avatar" />
        <span className="blog-logo-text">
          <span className="blog-logo-title">Counterxing</span>
          <span className="blog-logo-sub">Full-stack Agent Architecture · Product Thinking</span>
        </span>
      </Link>

      <nav className="blog-nav">
        <NavLink to="/">
          Home / 首页
        </NavLink>
        <NavLink to="/projects">
          Project / 项目
        </NavLink>
        <NavLink to="/articles">
          Articles / 文章
        </NavLink>
      </nav>

      <div className="blog-socials" aria-label="social links">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="blog-social"
            title={link.label}
            style={{ '--social-color': link.color, '--social-icon': `url(${link.icon})` }}
          >
            <span aria-hidden="true" />
          </a>
        ))}
      </div>
    </header>
  );
}

function Layout() {
  return (
    <Cursor>
      <div className="blog">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<Navigate to="/projects" replace />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/tag/:slug" element={<TagArchive />} />
          <Route path="/article/:number" element={<Article />} />
        </Routes>
        <SeaFooter />
      </div>
    </Cursor>
  );
}

function SeaFooter() {
  return (
    <footer className="blog-sea-footer" aria-hidden="true">
      <span className="sea-boat">⛵</span>
      <span className="sea-birds">⌁⌁</span>
      <span className="sea-whale">◖</span>
      <span className="sea-fish sea-fish-a">◆</span>
      <span className="sea-fish sea-fish-b">◆</span>
      <span className="sea-fish sea-fish-c">◆</span>
      <span className="sea-fish sea-fish-d">◆</span>
    </footer>
  );
}

function Home() {
  const navigate = useNavigate();
  const { issues, loading, error } = usePosts();
  const latest = issues.slice(0, 6);
  const heroCards = [
    {
      label: 'Who',
      title: '全栈产品架构 / 产品级工程',
      body: '从用户体验到系统交付，专注 AI Agent、产品化流程与可持续工程架构。',
      color: 'app-yellow',
    },
    {
      label: 'Now',
      title: 'AI Agent',
      body: '关注智能体架构、上下文工程、工具编排和真实工作流。',
      color: 'app-teal',
    },
    {
      label: 'Why',
      title: '产品思考',
      body: '把工程能力、多模态视频/图像处理和创作体验连接起来。',
      color: 'app-pink',
    },
  ];
  const experience = [
    { year: '2018-2024', role: '腾讯 · 前端架构师' },
    { year: '2024-2026', role: '大疆 · 全栈架构师' },
    { year: 'Now', role: 'AI Agent · 产品架构 · 独立开发' },
  ];
  const skills = [
    { name: 'AI Agent', color: 'app-blue' },
    { name: 'Agent Architecture', color: 'app-green' },
    { name: 'Full-stack', color: 'app-pink' },
    { name: 'Product Thinking', color: 'purple' },
    { name: 'Multimodal', color: 'brown' },
    { name: 'DevTools', color: 'app-teal' },
  ];

  return (
    <>
      <section className="blog-hero">
        <div className="blog-hero-text">
          <h1 className="blog-hero-title">
            <Typewriter speed={45}>counterxing</Typewriter>
          </h1>
          <p className="blog-hero-sub">
            把 AI Agent、全栈架构和产品思考连接起来，做能真实进入工作流的智能体系统和创作工具。
          </p>
          <div className="blog-hero-info">
            {heroCards.map((item) => (
              <Card key={item.label} color={item.color} className="blog-hero-info-card">
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Card>
            ))}
          </div>
          <div className="blog-hero-actions">
            <Button type="primary" size="large" onClick={() => navigate('/projects')}>
              项目 / Project
            </Button>
            <Button type="text" size="large" onClick={() => navigate('/articles')}>
              文章 / Articles
            </Button>
          </div>
          <a className="blog-scroll-cue" href="#projects">
            <span />
            Scroll / 下滑
          </a>
        </div>
        <div className="blog-hero-phone">
          <Phone />
        </div>
      </section>

      <Divider type="wave-yellow" />

      <section className="blog-section">
        <h2 className="blog-section-title">自己介绍</h2>
        <Card color="app-yellow" className="blog-about-card">
          <img className="blog-about-avatar" src="https://avatars.githubusercontent.com/xingbofeng" alt="Counterxing avatar" />
          <div className="blog-about-main">
            <h3>Counterxing · Full-stack Agent Architect</h3>
            <p>
              前腾讯前大疆研发专家，目前专注全栈 Agent 架构。把 AI Agent、全栈架构、产品思考和多模态视频/图像处理连接起来，做能真实进入工作流的智能体系统和创作工具。
            </p>
            <div className="blog-about-experience">
              {experience.map((item) => (
                <div key={item.year}>
                  <strong>{item.year}</strong>
                  <span>{item.role}</span>
                </div>
              ))}
            </div>
            <div className="blog-skill-list">
              {skills.map((skill) => (
                <Card key={skill.name} type="title" color={skill.color}>
                  {skill.name}
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="blog-section">
        <div className="blog-stats">
          <Card color="app-yellow">
            <div className="blog-stat">
              <div className="blog-stat-value">{issues.length || '—'}</div>
              <div className="blog-stat-label">Issues Posts</div>
            </div>
          </Card>
          <Card color="app-orange">
            <div className="blog-stat">
              <div className="blog-stat-value">{buildTagStats(issues).length || '—'}</div>
              <div className="blog-stat-label">Topics</div>
            </div>
          </Card>
          <Card color="app-teal">
            <div className="blog-stat">
              <div className="blog-stat-value">{profile.projects.length}</div>
              <div className="blog-stat-label">Projects</div>
            </div>
          </Card>
          <Card color="yellow-green">
            <div className="blog-stat">
              <div className="blog-stat-value">AI</div>
              <div className="blog-stat-label">Agent Focus</div>
            </div>
          </Card>
        </div>
      </section>

      <Divider type="line-teal" />

      <section id="projects" className="blog-section">
        <h2 className="blog-section-title">项目</h2>
        <div className="blog-projects-grid">
          {profile.projects.map((project, index) => (
            <ProjectCard key={project.href} project={project} color={cardColors[index]} />
          ))}
        </div>
      </section>

      <Divider type="line-brown" />

      <section className="blog-section">
        <div className="blog-section-head">
          <div>
            <h2 className="blog-section-title">最新文章</h2>
            <p className="blog-section-sub">自动从 GitHub Issues 同步为 posts。</p>
          </div>
          <Button type="text" onClick={() => navigate('/articles')}>
            全部文章 →
          </Button>
        </div>
        <PostGrid posts={latest} loading={loading} error={error} />
      </section>
    </>
  );
}

function ProjectCard({ project, color = 'app-yellow' }) {
  return (
    <a href={project.href} target="_blank" rel="noreferrer" className="blog-card-link">
      <Card color={color} className="blog-project-card">
        <div>
          <div className="blog-post-tag">#{project.kicker}</div>
          <h3 className="blog-post-title">{project.title}</h3>
          <p className="blog-post-excerpt">{project.zh}</p>
        </div>
        <div className="blog-post-meta">
          <span>{project.nameEn}</span>
          <span className="blog-post-more">打开 →</span>
        </div>
      </Card>
    </a>
  );
}

function Projects() {
  return (
    <section className="blog-section blog-page-section">
      <h1 className="blog-page-title">项目</h1>
      <p className="blog-section-sub">正在建设的 Agent-native 工具与本地优先产品。</p>
      <div className="blog-projects-grid">
        {profile.projects.map((project, index) => (
          <ProjectCard key={project.href} project={project} color={cardColors[index]} />
        ))}
      </div>
    </section>
  );
}

function Articles() {
  const { issues, loading, error } = usePosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get('tag') || '';
  const currentPage = Number(searchParams.get('page') || 1);
  const tags = useMemo(() => buildTagStats(issues), [issues]);
  const filtered = useMemo(() => (tag ? filterPosts(issues, { tag }) : issues), [issues, tag]);
  const page = useMemo(() => paginate(filtered, currentPage, 9), [filtered, currentPage]);

  function updateTag(nextTag) {
    const next = new URLSearchParams(searchParams);
    if (nextTag) next.set('tag', nextTag);
    else next.delete('tag');
    next.delete('page');
    setSearchParams(next);
  }

  function updatePage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  }

  return (
    <section className="blog-section blog-page-section">
      <h1 className="blog-page-title">文章</h1>
      <p className="blog-section-sub">GitHub Issues 会自动出现在这里，标签可用于筛选。</p>

      <div className="blog-tag-cloud">
        <button className={!tag ? 'active' : ''} onClick={() => updateTag('')}>
          全部 <span>{issues.length}</span>
        </button>
        {tags.map((item) => (
          <button key={item.slug} className={tag === item.slug ? 'active' : ''} onClick={() => updateTag(item.slug)}>
            {item.name} <span>{item.count}</span>
          </button>
        ))}
      </div>

      <PostGrid posts={page.items} loading={loading} error={error} />

      {page.totalPages > 1 && (
        <div className="blog-pagination">
          <Button disabled={page.currentPage === 1} onClick={() => updatePage(page.currentPage - 1)}>
            上一页
          </Button>
          <span>
            {page.currentPage} / {page.totalPages}
          </span>
          <Button disabled={page.currentPage === page.totalPages} onClick={() => updatePage(page.currentPage + 1)}>
            下一页
          </Button>
        </div>
      )}
    </section>
  );
}

function TagArchive() {
  const { slug } = useParams();
  const { issues, loading, error } = usePosts();
  const posts = useMemo(() => filterPosts(issues, { tag: slug }), [issues, slug]);

  return (
    <section className="blog-section blog-page-section">
      <h1 className="blog-page-title">#{slug}</h1>
      <PostGrid posts={posts} loading={loading} error={error} />
    </section>
  );
}

function PostGrid({ posts, loading, error }) {
  if (loading) return <div className="blog-state">正在加载 GitHub Issues...</div>;
  if (error) return <div className="blog-state blog-state-error">{error}</div>;
  if (!posts.length) return <div className="blog-state">暂无文章。</div>;

  return (
    <div className="blog-posts-grid">
      {posts.map((post, index) => (
        <Link key={post.number} to={`/article/${post.number}`} className="blog-card-link">
          <Card color={cardColors[index % cardColors.length]} className="blog-post-card">
            <div className="blog-post-tag">#{post.labels[0]?.name || 'post'}</div>
            <h3 className="blog-post-title">{post.title}</h3>
            <p className="blog-post-excerpt">{post.excerpt}</p>
            <div className="blog-post-meta">
              <span>{formatDate(post.createdAt)}</span>
              <span className="blog-post-more">阅读 →</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function Article() {
  const { number } = useParams();
  const { issues, loading, error } = usePosts();
  const post = issues.find((item) => String(item.number) === String(number));
  const neighbors = getNeighbors(issues, number);
  const html = DOMPurify.sanitize(marked.parse(post?.body || ''));

  if (loading) return <div className="blog-state">正在加载文章...</div>;
  if (error) return <div className="blog-state blog-state-error">{error}</div>;
  if (!post) return <div className="blog-state">文章不存在。</div>;

  return (
    <article className="blog-section blog-page-section blog-article">
      <Link to="/articles" className="blog-back">
        ← 返回文章
      </Link>
      <h1 className="blog-page-title">{post.title}</h1>
      <div className="blog-article-meta">
        <span>{formatDate(post.createdAt)}</span>
        <span>{post.readingTime} min read</span>
        <span>{post.labels.length} tags</span>
        {post.htmlUrl && (
          <a href={post.htmlUrl} target="_blank" rel="noreferrer">
            GitHub Issue
          </a>
        )}
      </div>
      <div className="blog-article-tags">
        {post.labels.map((label) => (
          <Link key={label.id} to={`/articles?tag=${label.slug}`}>
            #{label.name}
          </Link>
        ))}
      </div>
      <Card color="app-yellow" className="blog-article-card">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
      <div className="blog-neighbors">
        {neighbors.previous ? <Link to={`/article/${neighbors.previous.number}`}>上一篇：{neighbors.previous.title}</Link> : <span />}
        {neighbors.next ? <Link to={`/article/${neighbors.next.number}`}>下一篇：{neighbors.next.title}</Link> : <span />}
      </div>
    </article>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
