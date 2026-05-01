<script setup>
import { profile } from '../content/profile';

const identity = [
  'AI Agent Builder / Agentic Tooling Explorer',
  'AI Agent 构建者 / Agentic 工具链探索者',
  'Frontend & Visual Engineering Expert since 2015',
  '2015 年开始的前端与视觉工程长期主义者',
  'Medical Imaging / Video / Infinite Canvas / Visualization',
  '医学影像 / 视频处理 / 无限画布 / 前端可视化',
  'Former Tencent / Former DJI / Independent Developer',
  '前腾讯 / 前大疆 / 自由开发者',
  'Context Engineering Learner',
  '上下文工程学习者',
  'Open Source Enthusiast / Independent Developer',
  '开源爱好者 / 自由开发者',
];

const agentFocus = [
  ['Agentic Coding', '从简单问答走向任务规划、执行、反思与迭代'],
  ['Tool Orchestration', '让模型安全地使用 CLI、文件、浏览器、API 与项目上下文'],
  ['Context Engineering', '为 Agent 设计记忆、检索、指令与工作区感知能力'],
  ['Human-AI Workflow', '让工程师保持掌控，同时让 Agent 承担可重复的工程工作'],
];

const visualEngineering = [
  ['Medical Imaging', '医学影像查看器、标注流程、渲染性能与领域交互设计'],
  ['Image & Video Processing', '前端媒体加载、渲染、播放、交互与性能优化链路'],
  ['Infinite Canvas', '大画布交互、缩放平移、图层管理、选择操作与空间组织'],
  ['Frontend Visualization', '将复杂数据与视觉状态转化为清晰、响应快、可维护的工程系统'],
];

const care = [
  ['AI Agent Engineering', '关注 Agentic Coding 工作流、工具调用、Prompt 系统、上下文工程，以及真实软件项目中的人机协作。'],
  ['Visual Frontend Systems', '关注医学影像、图像/视频处理、无限画布工程、前端可视化，以及复杂视觉系统的长期可维护性。'],
  ['Developer Experience', '构建减少重复劳动、提升类型安全、自动化工程流程、帮助团队提效的工具。'],
  ['Product Planning', '关注图形图像类产品、Agent 画布体验、数据平台工作流，从问题定义到工程落地的产品规划。'],
];

const now = [
  'Exploring agents as engineering collaborators rather than flashy demos.',
  'Refining visual products and archive-like reading experiences.',
  'Writing about frontend systems, engineering tools, and agentic workflows.',
  '我正在探索如何把 Agent 做成工程协作者，而不只是“看起来很强”的 Demo。',
  '我在继续打磨视觉产品和更适合长文阅读的博客体验。',
  '我也会持续写前端系统、工程工具和 Agent 工作流相关内容。',
];
</script>

<template>
  <div class="page page-about">
    <section class="intro-panel glass-card">
      <div class="intro-panel__copy">
        <p class="eyebrow">About / 关于我</p>
        <h1 class="about-title">{{ profile.titleEn }}</h1>
        <h2>{{ profile.titleZh }}</h2>
        <p class="intro-panel__lead">{{ profile.heroEn }}</p>
        <p class="intro-panel__lead intro-panel__lead--zh">{{ profile.heroZh }}</p>
      </div>
      <div class="intro-panel__aside">
        <div class="quote-card">
          <p>My current obsession: turning AI Agents into reliable engineering collaborators, not just impressive demos.</p>
          <p>我现在最着迷的事情：把 AI Agent 做成可靠的工程协作者，而不只是看起来很酷的 Demo。</p>
        </div>
      </div>
    </section>

    <article class="glass-card article-body markdown-body about-article">
      <p class="section-kicker">About / 关于我</p>
      <p>
        I started frontend development in <strong>2015</strong>, graduated from the
        <strong>University of Electronic Science and Technology of China</strong> in <strong>2018</strong>,
        later worked at <strong>Tencent</strong> and <strong>DJI</strong>, and am now an independent developer.
      </p>
      <p>
        我从 <strong>2015</strong> 年开始接触前端，<strong>2018</strong> 年毕业于
        <strong>电子科技大学</strong>，后续先后在 <strong>腾讯</strong> 和 <strong>大疆</strong> 工作，现在是自由开发者。
      </p>
      <p>
        For years, I have built complex frontend systems, engineering tools, and product-level web applications,
        with deep experience in medical imaging, image/video processing, infinite canvas image engineering,
        and frontend visualization systems. Since <strong>2025</strong>, I have shifted a large part of my energy
        to <strong>AI Agent development</strong>, exploring agentic coding workflows, tool orchestration,
        context engineering, and the new collaboration model between humans and software.
      </p>
      <p>
        过去几年，我持续建设复杂前端系统、工程工具和产品级 Web 应用，并在医学影像、图像/视频处理、
        无限画布图像工程、前端可视化系统等方向积累了较深经验。自 <strong>2025</strong> 年起，
        我将更多精力投入到 <strong>AI Agent 开发</strong>，关注 Agentic Coding 工作流、工具编排、
        上下文工程，以及人与软件之间新的协作模式。
      </p>
      <p>
        I am an <strong>AI Agent enthusiast, frontend visual engineering expert, former Tencent and DJI engineer,
        technical writer, open-source enthusiast, and independent developer</strong>. My current focus is turning agents from
        “chatting models” into engineering collaborators that understand context, use tools, and participate
        in real development workflows.
      </p>
      <p>
        我是一名 <strong>AI Agent 狂热者 / 前端视觉工程专家 / 前腾讯 / 前大疆 / 技术博主 / 开源爱好者 / 自由开发者</strong>。
        现在我尤其关注如何把 Agent 从“能聊天的模型”推进到“能理解上下文、调用工具、参与真实工程流程的协作者”。
      </p>

      <h2>Identity / 身份标签</h2>
      <pre>{{ identity.join('\n') }}</pre>

      <h2>Agent Focus / Agent 关注方向</h2>
      <ul>
        <li v-for="item in agentFocus" :key="item[0]">
          <strong>{{ item[0] }}</strong>
          <span>{{ item[1] }}</span>
        </li>
      </ul>

      <blockquote>
        <p>My current obsession: turning AI Agents into reliable engineering collaborators, not just impressive demos.</p>
        <p>我现在最着迷的事情：把 AI Agent 做成可靠的工程协作者，而不只是看起来很酷的 Demo。</p>
      </blockquote>

      <h2>Visual Engineering / 视觉工程经验</h2>
      <ul>
        <li v-for="item in visualEngineering" :key="item[0]">
          <strong>{{ item[0] }}</strong>
          <span>{{ item[1] }}</span>
        </li>
      </ul>

      <blockquote>
        <p>The through line: I care about interfaces where pixels are not decoration, but the core product logic.</p>
        <p>这条经验主线是：我关注那些“像素不是装饰，而是产品核心逻辑”的前端系统。</p>
      </blockquote>

      <h2>What I Care About / 我关注什么</h2>
      <ul>
        <li v-for="item in care" :key="item[0]">
          <strong>{{ item[0] }}</strong>
          <span>{{ item[1] }}</span>
        </li>
      </ul>

      <h2>Now / 当前</h2>
      <ul>
        <li v-for="item in now" :key="item">{{ item }}</li>
      </ul>
    </article>

    <section class="links-grid">
      <a v-for="link in profile.links" :key="link.label" :href="link.href" target="_blank" rel="noreferrer" class="link-card glass-card">
        <div>
          <p class="section-kicker">{{ link.label }}</p>
          <h3>{{ link.descEn }}</h3>
          <p>{{ link.descZh }}</p>
        </div>
        <span>Open</span>
      </a>
    </section>
  </div>
</template>
