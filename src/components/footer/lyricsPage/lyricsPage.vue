<template>
  <div id="lyricsPage" class="lyrics_page">
    <div id="lyricsContainer" class="lyrics_container">
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

import { useLyricsStore } from '../../../stores/lyrics';
import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

import './lyricsPage.scss';

const router = useRouter();
const route = useRoute();

const lyricsStore = useLyricsStore();
const listStore = useCurrentPlayingListStore();

const lrc = ref<string[]>([]);

watch(
  () => listStore.current_song_index,
  (newValue) => {
    console.log(newValue);

    lrc.value = lyricsStore.getCurLyrics();
  }
);
</script>
