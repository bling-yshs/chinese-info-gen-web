<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <RouterLink to="/home" class="text-xl font-bold text-emerald-700">响应式学习站</RouterLink>
        <nav class="flex flex-wrap gap-3 text-sm text-slate-600">
          <a href="#" class="hover:text-emerald-700">项目</a>
          <a href="#" class="hover:text-emerald-700">关于</a>
          <a href="#" class="hover:text-emerald-700">联系我们</a>
          <a href="#" class="hover:text-emerald-700">帮助</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <article
          v-for="card in cards"
          :key="card.title"
          class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <img :src="card.image" :alt="card.title" class="h-36 w-full object-cover" />
          <div class="p-4">
            <h2 class="text-base font-semibold text-slate-900">{{ card.title }}</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">{{ card.description }}</p>
          </div>
        </article>
      </section>
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
        Tailwind 响应式布局练习页面
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const cards = [
  {
    title: '移动端优先',
    description: '默认不写断点，小屏幕下保持单列展示。',
    image: 'https://picsum.photos/seed/tailwind-card-1/640/360',
  },
  {
    title: '平板布局',
    description: '从 md 断点开始展示两列，内容更容易横向浏览。',
    image: 'https://picsum.photos/seed/tailwind-card-2/640/360',
  },
  {
    title: '桌面布局',
    description: '从 lg 断点开始展示五列，最大断点一行五个卡片。',
    image: 'https://picsum.photos/seed/tailwind-card-3/640/360',
  },
  {
    title: '图片区域',
    description: '每个卡片顶部放一张图片，使用 object-cover 保持比例。',
    image: 'https://picsum.photos/seed/tailwind-card-4/640/360',
  },
  {
    title: '卡片标题',
    description: '标题使用简单字号和字重，方便观察布局重点。',
    image: 'https://picsum.photos/seed/tailwind-card-5/640/360',
  },
  {
    title: '卡片介绍',
    description: '介绍文本保持简短，让响应式网格变化更直观。',
    image: 'https://picsum.photos/seed/tailwind-card-6/640/360',
  },
]
</script>
