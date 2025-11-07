<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-gray-700 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-black/70">
    <ul class="grid grid-cols-5 text-xs text-center">
      <li v-for="item in items" :key="item.to">
        <router-link :to="item.to" class="block py-2" :class="isActive(item.to) ? 'text-black dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'">
          <div>{{ item.label }}</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const auth = useAuthStore();

const items = computed(() => {
  const base = [
    { to: '/', label: '翻译' },
    { to: '/models', label: '模型' },
    { to: '/knowledge', label: '知识库' },
    { to: '/history', label: '历史' }
  ];
  const me = auth.user ? (auth.user.role === 'admin' ? { to: '/admin', label: '系统' } : { to: '/login', label: '我的' }) : { to: '/login', label: '登录' };
  return [...base, me];
});

function isActive(path: string) {
  return route.path === path;
}
</script>

<style scoped>
@supports (padding: max(0px)) {
  nav { padding-bottom: env(safe-area-inset-bottom); }
}
</style>


