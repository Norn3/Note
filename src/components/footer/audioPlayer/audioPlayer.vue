<template>
  <div id="audioPlayer" class="audioPlayer">
    <audio
      class="audio"
      id="audio"
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
      id="previousButton"
      class="button previous"
      @click="playPreviousSong"
    ></div>
    <div
      id="playButton"
      class="button play pause"
      ref="playButton"
      @click="pressPlayButton"
    ></div>
    <div id="nextButton" class="button next" @click="playNextSong"></div>
    <div id="coverImg" class="cover_img">
      <img :src="coverImg" alt="封面" />
    </div>
    <div id="songTitle" class="song_title">
      <span id="title" class="title">{{ songTitle }}</span>
      <span id="creator" class="creator" v-if="creatorName">{{
        ' - ' + creatorName
      }}</span>
    </div>
    <div
      id="progressControl"
      class="progress_control"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
    >
      <div id="progress" class="progress">
        <div class="current" :style="{ width: progressWidth }"></div>
      </div>
    </div>
    <div id="time" class="time">{{ curTime + '/' + songDuration }}</div>
    <div id="features" class="features">
      <div
        id="lyricsIcon"
        class="lyrics_icon"
        @click="toggleFeature('lyrics')"
      ></div>
      <lyrics-page
        id="lyricsPage"
        class="lyrics_page"
        :songId="loadLyricsSongId"
      ></lyrics-page>
      <div
        id="playinglistIcon"
        class="playinglist_icon"
        @click="toggleFeature('playinglist')"
      ></div>
      <playingList id="playingList" class="playing_list"></playingList>
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
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';
import './audioPlayer.scss';

import { get } from '../../../axios/insatance';
import Song from '../../../class/Song';

import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';
import { useLyricsStore } from '../../../stores/lyrics';
import processSongDuration from '../../../util/processSongDuration';

import SongListItem from '../../article/songList/songListItem/songListItem.vue';
import playingList from '../playingList/playingList.vue';
import lyricsPage from '../lyricsPage/lyricsPage.vue';
import { useLoginStateStore } from '../../../stores/loginState';

// ref引用的元素
const playButton = ref<HTMLElement | null>(null);
const volumeButton = ref<HTMLElement | null>(null);
const volumeBar = ref<HTMLElement | null>(null);
const volumeProgress = ref<HTMLElement | null>(null);
// 获取响应式audio对象
const audioRef = ref<HTMLAudioElement | null>(null);

// 播放列表store
let listStore = useCurrentPlayingListStore();

// 歌词store
let lyricsStore = useLyricsStore();

// 登录store
let loginStore = useLoginStateStore();

// 歌曲url控制
let songItem = ref('');
let nextSongItem = ''; // getSong的时候先获取到这里，再替换到songItem中

// 歌曲信息显示
const songTitle = ref('');
const creatorName = ref('');
const coverImg = ref('');
const songDuration = ref('00:00');
const curTime = ref('00:00');
let getCurTime: number | null = null;

let show_playinglist = false;
let show_lyrics = false;

const loadLyricsSongId = ref('');
const watchLyricsChange = ref(null);

// 点击功能图标，展示功能组件并固定住播放器
const toggleFeature = (item: string) => {
  const $feature = item == 'playinglist' ? $('#playingList') : $('#lyricsPage');
  if (item == 'playinglist') {
    if (show_playinglist) {
      $feature.removeClass(`show_${item}`);
    } else {
      $feature.addClass(`show_${item}`);
    }
    show_playinglist = !show_playinglist;
  } else if (item == 'lyrics') {
    if (show_lyrics) {
      $feature.removeClass(`show_${item}`);
    } else {
      $feature.addClass(`show_${item}`);
    }
    lyricsStore.toggleShowLyrics(!show_lyrics);
    show_lyrics = !show_lyrics;
  }

  if (show_playinglist || show_lyrics) {
    $('#audioPlayer').addClass('showing_feature');
  } else {
    $('#audioPlayer').removeClass('showing_feature');
  }
};

// 通过 $subscribe 订阅状态， subscribe()即可停止订阅
// 当前正在播放的歌曲改变，重新获取歌曲并播放
// const subscribeCurrentSong = songStore.$subscribe((mutation, state) => {
//   console.log('songUrl has changed:', state.songUrl);
//   getSong(state.songUrl);
//   songItem.value = nextSongItem;
//   play(0);
// });

// 播放列表被改变，重新获取播放列表并存入localStorage
// const subscribeCurrentPlaylist = listStore.$subscribe((mutation, state) => {
//   // 点击了歌单详情页的播放按钮，替换整个播放列表
//   console.log(mutation);

//     // playList();

// }, { detached: true })

// 获取歌曲url
const getSong = async (songId: string) => {
  await get<any>(
    `/song/url/v1?id=${songId}&level=standard&timestamp=${Date.now()}`
  )
    .then((response) => {
      // 处理返回的用户数据
      const song: Song = response.data;
      nextSongItem = song[0].url;
      // 调用播放方法，从头播放
    })
    .catch((error) => {
      // 处理请求错误
      console.log(error);
    });
};

// 播放操作
const play = (time: number) => {
  if (audioRef.value) {
    if (playButton.value) {
      playButton.value.classList.add('playing');
      playButton.value.classList.remove('pause');
    }
    try {
      // 发送请求的代码
      audioRef.value.load();
      audioRef.value.currentTime = time;
      audioRef.value.play();

      // 处理成功的响应
      console.log('成功响应:');
    } catch (error) {
      // 处理错误
      console.log('请求发生错误:', error);
      // 在这里执行你的处理逻辑
    }
  }
};

// 用id获取歌词，并把id传入lyricsStore
const preProcessNextSong = async (songId: string) => {
  await getSong(songId);
  await lyricsStore.setNextId(songId);
};

// 歌曲url和歌词都切换到下一首
const switchToNext = () => {
  songItem.value = nextSongItem;
  lyricsStore.switchToNextLyrics();
};

// 播放监听

// 绑定监听器
const addListener = () => {
  if (audioRef.value) {
    // 通过触发loadedmetadata识别上一首歌曲已加载，可以开始加载下一首歌曲，减少等待
    audioRef.value.addEventListener('loadedmetadata', songLoaded);

    // 结束后播放下一首
    audioRef.value.addEventListener('ended', playNextSong);
  }
};
// 监听是否需要切换当前歌曲
const watchCurSongReset = watch(
  () => listStore.cur_song_reset,
  async (newValue, oldValue) => {
    if (newValue) {
      clearInterval(Number(getCurTime));
      await preProcessNextSong(
        listStore.getSongId(listStore.current_song_index)
      );
      switchToNext();
      play(0);
      listStore.resetCurSong();
    }
  }
);

// 当前歌曲加载完毕，获取歌曲时长，绑定当前时长监听器并预加载下一首歌曲
const songLoaded = () => {
  // 挂载当前播放时间监听器
  getCurTime = Number(
    setInterval(() => {
      if (audioRef.value && songItem.value) {
        const currentTime = audioRef.value.currentTime * 1000;
        lyricsStore.currentTime = Math.floor(currentTime);
        curTime.value = processSongDuration(currentTime);
      }
    }, 1000)
  );

  // 根据播放时间判断是否初次加载完成
  if (audioRef.value && audioRef.value.currentTime == 0) {
    showSongInfo();

    // 获取下一首的url，即使不是初次加载，此时listStore.current_song_index也还没变，不会错误获取下下首歌曲
    listStore.getNextSong();
    preProcessNextSong(listStore.getSongId(listStore.next_song_index));
  }
};

// 当前歌曲播放结束或点击下一首，切换下一首歌曲的url进行播放
const playNextSong = () => {
  clearInterval(Number(getCurTime));
  listStore.nextCurIndex();
  switchToNext();
  play(0);
};

// 点击上一首，切换到上一首歌曲进行播放
const playPreviousSong = async () => {
  clearInterval(Number(getCurTime));
  listStore.preCurIndex();
  await preProcessNextSong(listStore.getSongId(listStore.current_song_index));
  switchToNext();
  play(0);
};

const showSongInfo = () => {
  const info = listStore.getSongInfo(listStore.current_song_index);
  // TODO：初次打开或播放列表被清空的时候，无法加载出图片名称等信息
  if (info == undefined) {
    console.log('播放列表为空');
  } else {
    coverImg.value = info.al.picUrl;
    lyricsStore.setCoverImg(coverImg.value);
    songTitle.value = info.name;
    creatorName.value = '';
    info.ar.forEach((item: any) => {
      if (creatorName.value == '') creatorName.value += item.name;
      else creatorName.value += '/' + item.name;
    });
    if (info.fee == '1') {
      songDuration.value =
        loginStore.getProfile().vipType == 0
          ? '00:30'
          : processSongDuration(info.dt);
    } else if (info.fee == '4') {
      songDuration.value = '00:30';
    } else {
      songDuration.value = processSongDuration(info.dt);
    }
  }
};

// let audio = document.getElementById('#audio');
// if (audio) {
//   audio.addEventListener('error', (event) => {
//     console.log('audio error');
//     console.log(event.target);
//   });
// }

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   console.log(msg, url, lineNo, columnNo, error);
// };

// window.addEventListener('error', function (event) {
//   console.log(event);
// });

// 挂载后执行
onMounted(async () => {
  await preProcessNextSong(listStore.getSongId(listStore.current_song_index));
  switchToNext();
  listStore.getNextSong();
  preProcessNextSong(listStore.getSongId(listStore.next_song_index));
  showSongInfo();
  addListener();
});
// 卸载前执行
onBeforeUnmount(() => {
  if (audioRef.value) {
    // 卸载监听器
    audioRef.value.removeEventListener('loadedmetadata', songLoaded);

    audioRef.value.removeEventListener('ended', playNextSong);
  }
});

// 点击播放图标，切换图标及播放状态
const pressPlayButton = () => {
  if (audioRef.value && playButton.value) {
    // 状态切换
    if (audioRef.value.paused) {
      const time = audioRef.value.currentTime;
      // 调用播放方法，从当前进度开始播放
      play(time);
    } else {
      clearInterval(Number(getCurTime));
      playButton.value.classList.remove('playing');
      playButton.value.classList.add('pause');
      audioRef.value.pause();
    }
  }
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

// 鼠标悬浮于上方时出现音量
$(document).on('mouseover', '#volume', () => {
  if (volumeProgress.value) {
    volumeProgress.value.classList.add('active');
  }
});
// 鼠标移开时音量消失
$(document).on('mouseout', '#volume', () => {
  if (volumeProgress.value) {
    volumeProgress.value.classList.remove('active');
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
