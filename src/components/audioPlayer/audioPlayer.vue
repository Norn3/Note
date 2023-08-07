<script setup lang="ts">
import $ from 'jquery';
import { ref } from 'vue';
import './audioPlayer.scss';

// 获取响应式audio对象
const audioRef = ref<HTMLAudioElement | null>(null);

// 点击播放按钮，播放状态切换
$(document).on('click', '#playButton', () => {
  if (audioRef.value) {
    if (audioRef.value.paused) {
      audioRef.value.play();
    } else {
      audioRef.value.pause();
    }
  }
});

const progressWidth = ref('0%');

const updateProgress = () => {
  if (audioRef.value) {
    const currentTime = audioRef.value.currentTime;
    const duration = audioRef.value.duration;
    const percentage = (currentTime / duration) * 100;
    progressWidth.value = `${percentage}%`;
  }
};
</script>

<template>
  <div class="audioPlayer">
    <audio class="audio" ref="audioRef" controls @timeupdate="updateProgress">
      <source
        src="../../assets/music/Biscuits - i hate u i love u.mp3"
        type="audio/mp3"
      />
      <source
        src="../../assets/music/Biscuits - i hate u i love u.mp3"
        type="audio/ogg"
      />
      Your browser does not support this audio format.
    </audio>
    <div class="play_button" id="playButton"></div>
    <div class="progress">
      <div class="current" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
