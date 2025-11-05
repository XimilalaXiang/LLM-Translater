<template>
  <div class="app min-h-screen bg-white">
    <!-- Header Navigation -->
    <header class="border-b border-gray-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-black">法律翻译审核系统</h1>
            <nav class="flex space-x-4">
              <router-link
                to="/"
                class="nav-link"
                active-class="nav-link-active"
              >
                翻译
              </router-link>
              <router-link
                to="/models"
                class="nav-link"
                active-class="nav-link-active"
              >
                模型配置
              </router-link>
              <router-link
                to="/knowledge"
                class="nav-link"
                active-class="nav-link-active"
              >
                知识库
              </router-link>
              <router-link
                to="/history"
                class="nav-link"
                active-class="nav-link-active"
              >
                历史记录
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useModelStore } from '@/stores/modelStore';
import { useKnowledgeStore } from '@/stores/knowledgeStore';

const modelStore = useModelStore();
const knowledgeStore = useKnowledgeStore();

onMounted(() => {
  // Load initial data
  modelStore.fetchModels();
  knowledgeStore.fetchKnowledgeBases();
});
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors;
}

.nav-link-active {
  @apply text-black bg-gray-100;
}
</style>
