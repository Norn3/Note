<script setup lang="ts">
import $ from 'jquery';
import { ref } from 'vue';
import './audioPlayer.scss';

// 获取响应式audio对象
const audioRef = ref<HTMLAudioElement | null>(null);

// 点击播放按钮，播放状态与图标切换
$(document).on('click', '#playButton', () => {
  if (audioRef.value) {
    // 图标切换
    const playButton = $('#playButton')[0] as HTMLElement;
    playButton.classList.toggle('playing');
    playButton.classList.toggle('pause');
    // 状态切换
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

// 播放进度控制
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartTime = ref(0);

const handleDragStart = (event: MouseEvent) => {
  const progressBar = $('#progressControl')[0] as HTMLElement;
  const progressBarWidth = progressBar.offsetWidth;
  const progressBarLeft = progressBar.offsetLeft;

  isDragging.value = true;
  dragStartX.value = event.clientX;

  // 让进度来到点击的位置，并把进度作为拖动初始位置
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

// 鼠标悬浮于上方时出现音量
$(document).on('mouseover', '#volume', () => {
  const volumeProgress = $('#volumeProgress')[0];
  volumeProgress.style.height = '100px';
});
// 鼠标移开时音量消失
$(document).on('mouseout', '#volume', () => {
  const volumeProgress = $('#volumeProgress')[0];
  volumeProgress.style.height = '0px';
});

// 音量控制
const volumeHeight = ref('100%'); // 音量高度显示

let notMutedVolume = 0; // 静音前音量

const isDraggingVolume = ref(false); // 是否正在拖动调节音量
const volumeDragStartY = ref(0); // 开始拖动位置
const volumeDragStartVolume = ref(0); // 开始拖动时的音量

// 音量图标

// 点击图标
$(document).on('click', '#volumeIcon', () => {
  if (audioRef.value) {
    if (audioRef.value.muted || audioRef.value.volume == 0) {
      audioRef.value.volume = notMutedVolume;
    } else {
      notMutedVolume = audioRef.value.volume;
      audioRef.value.volume = 0;
    }
  }
});
// 音量改变时，静音与否以及音量大小将同步显示
const updateVolume = () => {
  if (audioRef.value) {
    if (audioRef.value.muted || audioRef.value.volume == 0) {
      const volumeButton = $('#volumeIcon')[0] as HTMLElement;
      volumeButton.classList.remove('not_muted');
      volumeButton.classList.add('muted');
      volumeHeight.value = '0%';
    } else {
      const volumeButton = $('#volumeIcon')[0] as HTMLElement;
      volumeButton.classList.add('not_muted');
      volumeButton.classList.remove('muted');
      const currentVolume = audioRef.value.volume;
      volumeHeight.value = `${currentVolume * 100}%`;
    }
  }
};

const handleVolumeDragStart = (event: MouseEvent) => {
  const volumeBar = $('#volumeControl')[0] as HTMLElement;
  const volumeBarHeight = volumeBar.offsetHeight; // 获取元素总的高度
  const volumeBarTop = volumeBar.offsetTop; // 获取元素相对父级的顶端位置
  console.log('volumeBar.offsetHeight' + volumeBar.offsetHeight);
  console.log('volumeBar.offsetTop' + volumeBar.offsetTop);
  isDraggingVolume.value = true;
  volumeDragStartY.value = event.offsetY; // 获取拖动开始时相对文档的垂直坐标，在#volumeControl元素长度为100时，event.offsetY为0~99
  console.log('event.offsetY' + event.offsetY);

  if (audioRef.value) {
    // 若audio存在
    audioRef.value.volume =
      1 - (event.offsetY - volumeBarTop) / volumeBarHeight; // 将音量变为拖动开始时的音量
    console.log('audioRef.value.volume' + audioRef.value.volume);

    volumeDragStartVolume.value = audioRef.value.volume; // 获得初始音量
  }
};
const handleVolumeDragMove = (event: MouseEvent) => {
  if (isDraggingVolume.value) {
    const volumeBar = $('#volumeControl')[0] as HTMLElement;
    const deltaY = 100 - event.offsetY + (100 - volumeDragStartY.value); // 计算拖动距离
    console.log('event.offsetY' + event.offsetY);
    console.log('volumeDragStartY' + volumeDragStartY.value);

    console.log('deltaY' + deltaY);

    const volumeBarHeight = volumeBar.offsetHeight; // 获得元素高度

    if (audioRef.value) {
      const newVolume = deltaY / volumeBarHeight; // 获得移动比例,即音量变化
      // 更新音频的音量
      audioRef.value.volume =
        1 - (volumeDragStartVolume.value + (1 - newVolume));
      console.log('audioRef.value.volume' + audioRef.value.volume);
    }
  }
};

const handleVolumeDragEnd = () => {
  isDraggingVolume.value = false;
  console.log(isDraggingVolume.value);
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
    <div id="playButton" class="play_button pause"></div>
    <div
      id="progressControl"
      class="progressControl"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
    >
      <div id="progress" class="progress">
        <div class="current" :style="{ width: progressWidth }"></div>
      </div>
    </div>

    <div id="volume" class="volume">
      <!-- 音量控制条 -->
      <div
        id="volumeControl"
        class="volumeControl"
        @mousedown="handleVolumeDragStart"
        @mousemove="handleVolumeDragMove"
        @mouseup="handleVolumeDragEnd"
        @mouseleave="handleVolumeDragEnd"
      >
        <!-- 音量条及内部音量大小 -->
        <div id="volumeProgress" class="volumeProgress">
          <!-- 点击调节音量时点到，容易导致eventTarget从volumeControl变成currentVolume，所以要加上pointerEvents: 'none' -->
          <div
            class="currentVolume"
            :style="{ height: volumeHeight, pointerEvents: 'none' }"
          ></div>
        </div>
      </div>
      <!-- 音量图标 -->
      <div
        id="volumeIcon"
        class="volumeIcon not_muted"
        ref="volumeButton"
      ></div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
