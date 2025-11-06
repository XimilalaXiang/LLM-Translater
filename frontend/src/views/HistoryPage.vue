<template>
  <div class="history-page">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-black dark:text-white mb-2">翻译历史</h2>
          <p class="text-gray-600 dark:text-gray-300">查看历史翻译记录</p>
        </div>
        <div class="w-full max-w-md">
          <button
            @click="openSearch()"
            class="w-full flex items-center justify-between px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 hover:border-black dark:hover:border-white transition-colors"
            aria-label="搜索历史记录"
          >
            <span class="text-sm">搜索历史原文…</span>
            <span class="text-xs text-gray-400">Ctrl / ⌘ + K</span>
          </button>
        </div>
      </div>
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
      <div class="bg-white dark:bg-zinc-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto overscroll-contain">
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
              <div v-if="!result.error" class="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200" v-html="renderMd(result.output)"></div>
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
              <div v-if="!result.error" class="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200" v-html="renderMd(result.output)"></div>
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
              <div v-if="!result.error" class="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200" v-html="renderMd(result.output)"></div>
              <p v-else class="text-red-500 text-sm">{{ result.error }}</p>
            </div>
          </div>
        </div>

        <!-- Final Translation -->
        <div v-if="selectedItem.finalTranslation" class="bg-black text-white rounded-lg p-6">
          <h4 class="font-bold mb-3">最终译文</h4>
          <div class="prose prose-invert max-w-none" v-html="renderMd(selectedItem.finalTranslation)"></div>
          <div class="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-300">
            总耗时: {{ selectedItem.totalDuration }}ms
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Search Overlay moved outside modal and teleported to body -->
  <teleport to="body">
    <div
      v-if="searchOpen"
      class="fixed inset-0 z-[60] bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center p-4"
      @click.self="closeSearch()"
    >
      <div class="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            ref="searchInputRef"
            v-model="searchText"
            type="text"
            placeholder="输入法律英语原文片段进行搜索…"
            class="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-zinc-800 text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white"
            @input="onSearchInput"
          />
        </div>
        <div class="max-h-[60vh] overflow-y-auto overscroll-contain">
          <div v-if="searching" class="p-6 text-center text-gray-500 dark:text-gray-400">
            正在搜索…
          </div>
          <div v-else>
            <div
              v-for="item in searchResults"
              :key="item.id"
              class="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
              @click="selectFromSearch(item)"
            >
              <p class="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{{ item.sourceText }}</p>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                <span>{{ formatDate(item.createdAt) }}</span>
                <span>阶段1: {{ item.stage1Results.length }} 模型</span>
                <span v-if="item.stage2Results.length > 0">阶段2: {{ item.stage2Results.length }} 审核</span>
              </div>
            </div>
            <div v-if="!searchResults.length && searchText.trim() !== '' && !searching" class="p-6 text-center text-gray-500 dark:text-gray-400">没有匹配的历史记录</div>
            <div v-if="searchText.trim() === '' && !searching" class="p-6 text-center text-gray-500 dark:text-gray-400">输入关键词开始搜索</div>
          </div>
        </div>
        <div class="p-3 text-right text-xs text-gray-500 dark:text-gray-400">按 Esc 关闭</div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { useTranslationStore } from '@/stores/translationStore';
import type { TranslationResponse } from '@/types';

const translationStore = useTranslationStore();

const selectedItem = ref<TranslationResponse | null>(null);

const history = computed(() => translationStore.history);
const loading = computed(() => translationStore.loading);
const searchResults = computed(() => translationStore.searchResults);

onMounted(() => {
  translationStore.fetchHistory();
  window.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
});

// Search overlay state (declare BEFORE watchers)
const searchOpen = ref(false);
const searchText = ref('');
const searching = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
let debounceTimer: any = null;

// Body scroll lock when any overlay is open
const isOverlayOpen = () => !!selectedItem.value || searchOpen.value;
watch([selectedItem, () => searchOpen.value], () => {
  const locked = isOverlayOpen();
  const html = document.documentElement;
  const body = document.body;
  if (locked) {
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
  } else {
    html.style.overflow = '';
    body.style.overflow = '';
  }
}, { immediate: true });

function openSearch() {
  selectedItem.value = null; // 避免与详情弹窗叠加
  searchOpen.value = true;
  searchText.value = '';
  nextTick(() => {
    searchInputRef.value?.focus();
  });
}
function closeSearch() {
  searchOpen.value = false;
  searching.value = false;
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearch();
  } else if (e.key === 'Escape') {
    if (searchOpen.value) {
      closeSearch();
    } else if (selectedItem.value) {
      selectedItem.value = null;
    }
  }
}

async function triggerSearch() {
  searching.value = true;
  await translationStore.searchHistory(searchText.value, 50);
  searching.value = false;
}

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerSearch();
  }, 300);
}

function selectFromSearch(item: TranslationResponse) {
  selectedItem.value = item;
  closeSearch();
}

const handleViewDetail = (item: TranslationResponse) => {
  selectedItem.value = item;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
};

// Markdown renderer (reuse HomePage behavior)
const md = new MarkdownIt({ breaks: true, linkify: true, typographer: true });
const normalizeMarkdown = (input: string) => {
  let out = input.replace(/\r\n/g, '\n');
  out = out.replace(/\uFF03/g, '#').replace(/\u3000/g, ' ');
  out = out.replace(/^[ \t]+(?=#)/gm, '');
  return out;
};
const renderMd = (text?: string) => {
  if (!text) return '';
  try {
    return md.render(normalizeMarkdown(String(text)));
  } catch {
    return String(text);
  }
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
