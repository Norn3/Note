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

// 进度显示
const progressWidth = ref('0%');

const updateProgress = () => {
  if (audioRef.value) {
    const currentTime = audioRef.value.currentTime;
    const duration = audioRef.value.duration;
    const percentage = (currentTime / duration) * 100;
    progressWidth.value = `${percentage}%`;
  }
};

// 进度控制
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartTime = ref(0);

const handleDragStart = (event: MouseEvent) => {
  const progressBar = $('#progressControl')[0] as HTMLElement;
  const progressBarWidth = progressBar.offsetWidth;
  const progressBarLeft = progressBar.offsetLeft;

  isDragging.value = true;
  dragStartX.value = event.clientX;

  if (audioRef.value) {
    audioRef.value.currentTime =
      audioRef.value.duration *
      ((event.clientX - progressBarLeft) / progressBarWidth);
    dragStartTime.value = audioRef.value.currentTime;
  }
};
const handleDragMove = (event: MouseEvent) => {
  if (isDragging.value) {
    const progressBar = $('#progressControl')[0] as HTMLElement;
    const deltaX = event.clientX - dragStartX.value;

    const progressBarWidth = progressBar.offsetWidth;
    const relativeDelta = deltaX / progressBarWidth;
    if (audioRef.value) {
      const newTime = audioRef.value.duration * relativeDelta;
      // 更新音频的 currentTime
      audioRef.value.currentTime = dragStartTime.value + newTime;
    }
  }
};

const handleDragEnd = () => {
  isDragging.value = false;
};

// 鼠标悬浮于图标上方时出现音量
$(document).on('mouseover', '#volumeControl', () => {
  const volumeProgress = $('#volumeProgress')[0];
  volumeProgress.style.display = 'block';
});
// 鼠标移开时音量消失
$(document).on('mouseout', '#volumeControl', () => {
  const volumeProgress = $('#volumeProgress')[0];
  volumeProgress.style.display = 'none';
});

// 音量控制
const volumeHeight = ref('0%');

const updateVolume = () => {
  if (audioRef.value) {
    if (audioRef.value.muted) {
      volumeHeight.value = '0%';
    } else {
      const currentVolume = audioRef.value.volume;
      volumeHeight.value = `${currentVolume * 100}%`;
    }
  }
};
</script>

<template>
  <div class="audioPlayer">
    <audio
      class="audio"
      ref="audioRef"
      controls
      @timeupdate="updateProgress"
      @volumechange="updateVolume"
    >
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
    <div id="playButton" class="play_button"></div>
    <div
      id="progressControl"
      class="progressControl"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
    >
      <div id="progress" class="progress">
        <div class="current" :style="{ width: progressWidth }"></div>
      </div>
    </div>

    <div id="volumeControl" class="volumeControl">
      <div id="volumeIcon" class="volumeIcon"></div>
      <div id="volumeProgress" class="volumeProgress">
        <div class="currentVolume" :style="{ height: volumeHeight }"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
