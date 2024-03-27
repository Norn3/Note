<template>
  <div id="lyricsPage" class="lyrics_page">
    <div id="lyricsContainer" class="lyrics_container">
      <loading-state :loading="loading" class="loading_state"></loading-state>
      <ul>
        <li v-for="(item, index) in lrc" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { onMounted, ref, nextTick, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import loadingState from '../../article/loadingState/loadingState.vue';

import { useLyricsStore } from '../../../stores/lyrics';
import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

import './lyricsPage.scss';

const router = useRouter();
const route = useRoute();

const loading = ref(true);

const lyricsStore = useLyricsStore();
const listStore = useCurrentPlayingListStore();

const lrc = ref<string[]>([]);

const loadCurLyrics = () => {
  loading.value = true;
  lrc.value = lyricsStore.getCurLyrics();
  loading.value = false;
};

watch(
  () => lyricsStore.showLyrics,
  (newValue) => {
    if (newValue) {
      loadCurLyrics();
    }
  }
);

watch(
  () => lyricsStore.curLyrics,
  (newValue) => {
    loadCurLyrics();
  }
);
</script>
