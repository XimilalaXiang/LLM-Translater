import { defineStore } from 'pinia';
import { ref } from 'vue';
import { translationApi } from '@/api';
import type { TranslationRequest, TranslationResponse } from '@/types';

export const useTranslationStore = defineStore('translation', () => {
  const currentTranslation = ref<TranslationResponse | null>(null);
  const history = ref<TranslationResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function translate(request: TranslationRequest) {
    loading.value = true;
    error.value = null;
    try {
      const response = await translationApi.translate(request);
      if (response.success && response.data) {
        currentTranslation.value = response.data;
        return response.data;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Translation failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchHistory(limit?: number) {
    try {
      const response = await translationApi.getHistory(limit);
      if (response.success && response.data) {
        history.value = response.data;
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }

  async function loadTranslation(id: string) {
    try {
      const response = await translationApi.getById(id);
      if (response.success && response.data) {
        currentTranslation.value = response.data;
        return response.data;
      }
    } catch (err) {
      console.error('Failed to load translation:', err);
    }
  }

  function clearCurrent() {
    currentTranslation.value = null;
    error.value = null;
  }

  return {
    currentTranslation,
    history,
    loading,
    error,
    translate,
    fetchHistory,
    loadTranslation,
    clearCurrent
  };
});
