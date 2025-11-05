<template>
  <div class="history-page">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-black dark:text-white mb-2">翻译历史</h2>
      <p class="text-gray-600 dark:text-gray-300">查看历史翻译记录</p>
    </div>

    <!-- History List -->
    <div class="space-y-4">
      <div
        v-for="item in history"
        :key="item.id"
        class="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
        @click="handleViewDetail(item)"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <p class="text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">{{ item.sourceText }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatDate(item.createdAt) }}</span>
              <span>耗时: {{ item.totalDuration }}ms</span>
              <span>阶段1: {{ item.stage1Results.length }}个模型</span>
              <span v-if="item.stage2Results.length > 0">
                阶段2: {{ item.stage2Results.length }}个审核
              </span>
              <span v-if="item.stage3Results.length > 0">
                阶段3: {{ item.stage3Results.length }}个模型
              </span>
            </div>
          </div>
        </div>

        <div v-if="item.finalTranslation" class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
          <p class="text-sm text-gray-700 dark:text-gray-200 line-clamp-3">{{ item.finalTranslation }}</p>
        </div>
      </div>

      <div v-if="history.length === 0 && !loading" class="text-center py-12 text-gray-500 dark:text-gray-400">
        暂无翻译历史
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="spinner mx-auto"></div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedItem"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedItem = null"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-bold">翻译详情</h3>
          <button
            @click="selectedItem = null"
            class="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <!-- Source Text -->
        <div class="mb-6">
          <h4 class="font-bold mb-2">原文</h4>
          <div class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4">
            <p class="text-gray-800 dark:text-gray-200">{{ selectedItem.sourceText }}</p>
          </div>
        </div>

        <!-- Stage 1 Results -->
        <div class="mb-6">
          <h4 class="font-bold mb-3 flex items-center">
            <span class="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mr-2 text-xs">1</span>
            初始翻译
          </h4>
          <div class="space-y-3">
            <div
              v-for="result in selectedItem.stage1Results"
              :key="result.modelId"
              class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-sm">{{ result.modelName }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ result.duration }}ms</span>
              </div>
              <p v-if="!result.error" class="text-gray-800 dark:text-gray-200 text-sm">{{ result.output }}</p>
              <p v-else class="text-red-500 text-sm">{{ result.error }}</p>
            </div>
          </div>
        </div>

        <!-- Stage 2 Results -->
        <div v-if="selectedItem.stage2Results.length > 0" class="mb-6">
          <h4 class="font-bold mb-3 flex items-center">
            <span class="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mr-2 text-xs">2</span>
            审核评价
          </h4>
          <div class="space-y-3">
            <div
              v-for="result in selectedItem.stage2Results"
              :key="`${result.modelId}-${result.translationModelId}`"
              class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-sm">{{ result.modelName }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ result.duration }}ms</span>
              </div>
              <p v-if="!result.error" class="text-gray-800 dark:text-gray-200 text-sm">{{ result.output }}</p>
              <p v-else class="text-red-500 text-sm">{{ result.error }}</p>
            </div>
          </div>
        </div>

        <!-- Stage 3 Results -->
        <div v-if="selectedItem.stage3Results.length > 0" class="mb-6">
          <h4 class="font-bold mb-3 flex items-center">
            <span class="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center mr-2 text-xs">3</span>
            综合翻译
          </h4>
          <div class="space-y-3">
            <div
              v-for="result in selectedItem.stage3Results"
              :key="result.modelId"
              class="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-sm">{{ result.modelName }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ result.duration }}ms</span>
              </div>
              <p v-if="!result.error" class="text-gray-800 dark:text-gray-200 text-sm">{{ result.output }}</p>
              <p v-else class="text-red-500 text-sm">{{ result.error }}</p>
            </div>
          </div>
        </div>

        <!-- Final Translation -->
        <div v-if="selectedItem.finalTranslation" class="bg-black text-white rounded-lg p-6">
          <h4 class="font-bold mb-3">最终译文</h4>
          <p class="leading-relaxed">{{ selectedItem.finalTranslation }}</p>
          <div class="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-300">
            总耗时: {{ selectedItem.totalDuration }}ms
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTranslationStore } from '@/stores/translationStore';
import type { TranslationResponse } from '@/types';

const translationStore = useTranslationStore();

const selectedItem = ref<TranslationResponse | null>(null);

const history = computed(() => translationStore.history);
const loading = computed(() => translationStore.loading);

onMounted(() => {
  translationStore.fetchHistory();
});

const handleViewDetail = (item: TranslationResponse) => {
  selectedItem.value = item;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
