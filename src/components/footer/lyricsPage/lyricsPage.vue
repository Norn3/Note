<template>
  <div id="lyricsPage" class="lyrics_page">
    <div id="coverContainer" class="cover_container">
      <div id="lyricsCoverImg" class="lyrics_cover_img"></div>
    </div>
    <div id="lyricsContainer" class="lyrics_container">
      <loading-state :loading="loading" class="loading_state"></loading-state>
      <ul class="lyrics">
        <li
          v-for="(item, index) in lyric"
          :key="index"
          :id="`lyricLine${index}`"
          class="lyric"
        >
          {{ item.lrc }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import $ from 'jquery';
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

interface lyrics {
  time: number;
  lrc: string;
}

const showingIndex = ref(0);

const lyric = ref<lyrics[]>([]);

const loadCurLyrics = () => {
  loading.value = true;
  lyric.value = lyricsStore.getCurLyrics();
  loading.value = false;
};

watch(
  [() => lyricsStore.showLyrics, () => lyricsStore.curLyrics],
  ([showLyrics, curLyrics]) => {
    if (showLyrics || curLyrics) {
      loadCurLyrics();
    }
  }
);

watch(
  () => lyricsStore.coverImg,
  (newValue) => {
    $('#lyricsCoverImg').css('background-image', `url(${newValue})`);
  }
);

watch(
  () => lyricsStore.currentTime,
  (newValue) => {
    for (let i = 0; i < lyric.value.length; i++) {
      if (lyric.value[i].time > newValue) {
        $('.lyric').removeClass('current_line');
        $(`#lyricLine${i - 1}`).addClass('current_line');
        // if(i > 4) $(`.lyrics`)[0].scrollTop = 80 * (i - 4);
        $(`.lyrics`).css('transform', `translateY(${350 - 80 * i}px)`);

        return;
      }
    }
  }
);
</script>
