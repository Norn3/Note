<template>
  <div class="audioPlayer">
    <audio
      class="audio"
      ref="audioRef"
      controls
      @timeupdate="updateProgress"
      @volumechange="updateVolume"
    >
      <source :src="songItem" type="audio/mp3" />
      <source :src="songItem" type="audio/ogg" />
      Your browser does not support this audio format.
    </audio>
    <div
      id="playButton"
      class="play_button pause"
      ref="playButton"
      @click="pressPlayButton"
    ></div>
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
        ref="volumeBar"
        @mousedown="handleVolumeDragStart"
        @mousemove="handleVolumeDragMove"
        @mouseup="handleVolumeDragEnd"
        @mouseleave="handleVolumeDragEnd"
      >
        <!-- 音量条及内部音量大小 -->
        <div id="volumeProgress" class="volumeProgress" ref="volumeProgress">
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
<script setup lang="ts">
import $ from 'jquery';
import { onMounted, reactive, ref } from 'vue';
import './audioPlayer.scss';

import { get } from '../../../axios/insatance';
import Song from '../../../class/Song';

import { useCurrentSongStore } from '../../../stores/currentPlayingSong';
import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';
import SongListItem from '../../article/songList/songListItem/songListItem.vue';

// ref引用的元素
const playButton = ref<HTMLElement | null>(null);
const volumeButton = ref<HTMLElement | null>(null);
const volumeBar = ref<HTMLElement | null>(null);
const volumeProgress = ref<HTMLElement | null>(null);

let playingList: Array<number> = reactive([]);

let playMode = ref('sequential');

let listStore = useCurrentPlayingListStore();
let songStore = useCurrentSongStore();
let currentSongId = 0;

// 通过 $subscribe 订阅状态， subscribe()即可停止订阅
// 当前正在播放的歌曲改变，重新获取歌曲并播放
const subscribeCurrentSong = songStore.$subscribe((mutation, state) => {
  console.log('songUrl has changed:', state.songUrl);
  currentSongId = state.songUrl;
  getSong();
  play(0);
});

// 播放列表被改变，重新获取播放列表并存入localStorage
const subscribeCurrentPlaylist = listStore.$subscribe((mutation, state) => {
  console.log('playingListIds has changed:', state.playingListIds);
  // 点击了歌单详情页的播放按钮，替换整个播放列表
  if (state.patchState == true) {
    playingList = reactive([]);
    state.playingListIds.forEach((element: number) => {
      playingList.push(element);
    });
    playList();
  }
  // 在原播放列表基础上进行编辑，没有替换整个播放列表

  localStorage.setItem('currentPlayingList', state.playingListIds.toString());
});

// 获取响应式audio对象
const audioRef = ref<HTMLAudioElement | null>(null);
let songItem = ref('');

// 播放操作
const play = (time: number) => {
  if (audioRef.value) {
    if (playButton.value) {
      playButton.value.classList.add('playing');
      playButton.value.classList.remove('pause');
    }
    audioRef.value.load();
    audioRef.value.currentTime = time;
    audioRef.value.play();
  }
};

// 获取某首歌曲
const getSong = async () => {
  await get<any>(`/song/url/v1?id=${currentSongId}&level=standard`)
    .then((response) => {
      console.log(response);

      // 处理返回的用户数据
      const song: Song = response.data;
      songItem.value = song[0].url;
      console.log(currentSongId);
      console.log(songItem.value);
      // 调用播放方法，从头播放
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });
};

// 点击播放图标，切换图标及播放状态
const pressPlayButton = () => {
  if (audioRef.value && playButton.value) {
    // 状态切换
    if (audioRef.value.paused) {
      const time = audioRef.value.currentTime;
      // 调用播放方法，从当前进度开始播放
      play(time);
    } else {
      playButton.value.classList.remove('playing');
      playButton.value.classList.add('pause');
      audioRef.value.pause();
    }
  }
};

const playList = async () => {
  if (playingList.length > 0) {
    let nextSong = 0;
    currentSongId = playingList[nextSong];
    await getSong();
    play(0);
    if (audioRef.value) {
      // 通过触发loadedmetadata识别上一首歌曲已加载，可以开始加载下一首歌曲，减少等待
      audioRef.value.addEventListener('loadedmetadata', () => {
        if (playMode.value == 'sequential') {
          if (nextSong < playingList.length - 1) {
            nextSong++;
          } else {
            nextSong = 0;
          }
          getNextSong(playingList[nextSong]);
        }
      });
      audioRef.value.addEventListener('ended', () => {
        play(0);
      });
    }
  }
};

const getNextSong = async (id: number) => {
  await get<any>(`/song/url/v1?id=${id}&level=standard`)
    .then((response) => {
      console.log(response);

      // 处理返回的用户数据
      const song: Song = response.data;
      songItem.value = song[0].url;
      // 调用播放方法，从头播放
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });
};

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
  const progressBar = $('#progressControl')[0];
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
    const progressBar = $('#progressControl')[0];
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
  if (volumeProgress.value) {
    volumeProgress.value.style.height = '100px';
  }
});
// 鼠标移开时音量消失
$(document).on('mouseout', '#volume', () => {
  if (volumeProgress.value) {
    volumeProgress.value.style.height = '0px';
  }
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
  if (audioRef.value && volumeButton.value) {
    if (audioRef.value.muted || audioRef.value.volume == 0) {
      volumeButton.value.classList.remove('not_muted');
      volumeButton.value.classList.add('muted');
      volumeHeight.value = '0%';
    } else {
      volumeButton.value.classList.add('not_muted');
      volumeButton.value.classList.remove('muted');
      const currentVolume = audioRef.value.volume;
      volumeHeight.value = `${currentVolume * 100}%`;
    }
  }
};

// 改变音量
const handleVolumeDragStart = (event: MouseEvent) => {
  if (volumeBar.value) {
    const volumeBarHeight = volumeBar.value.offsetHeight; // 获取元素总的高度
    const volumeBarTop = volumeBar.value.offsetTop; // 获取元素相对父级的顶端位置
    isDraggingVolume.value = true;
    volumeDragStartY.value = event.offsetY; // 获取拖动开始时相对文档的垂直坐标，在#volumeControl元素长度为100时，event.offsetY为0~99

    if (audioRef.value) {
      // 若audio存在
      audioRef.value.volume =
        1 - (event.offsetY - volumeBarTop) / volumeBarHeight; // 将音量变为拖动开始时的音量
      volumeDragStartVolume.value = audioRef.value.volume; // 获得初始音量
    }
  }
};
const handleVolumeDragMove = (event: MouseEvent) => {
  if (isDraggingVolume.value && volumeBar.value) {
    const deltaY = 100 - event.offsetY + (100 - volumeDragStartY.value); // 计算拖动距离
    const volumeBarHeight = volumeBar.value.offsetHeight; // 获得元素高度

    if (audioRef.value) {
      const newVolume = deltaY / volumeBarHeight; // 获得移动比例,即音量变化
      // 更新音频的音量
      audioRef.value.volume =
        1 - (volumeDragStartVolume.value + (1 - newVolume));
    }
  }
};

const handleVolumeDragEnd = () => {
  isDraggingVolume.value = false;
};
</script>
