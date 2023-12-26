<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick, ref, useAttrs } from 'vue';
import router from '../../../../router/index';
import { get } from '../../../../axios/insatance';

import processSongDuration from '../../../../util/processSongDuration'; // 处理时长

import './songListItem.scss';

import { useCurrentSongStore } from '../../../../stores/currentPlayingSong';

const props = defineProps({
  type: String,
  listId: Number,
  songId: Number,
  name: String,
  durationTime: Number,
  singer: Array<string>,
  album: String,
  albumId: Number,
});

const singer_list = () => {
  let str = '';
  if (props.singer) {
    props.singer.forEach((element: string) => {
      if (str != '') {
        str = str + '，' + element;
      } else {
        str += element;
      }
    });
  }
  return str;
};

const jumpPage = (type: string, id: number) => {
  router.push({
    name: 'Info',
    query: {
      type: type,
      id: id,
    },
  });
};

// 可以在组件中的任意位置访问 `store` 变量 ✨
const songStore = useCurrentSongStore();

const playSong = () => {
  songStore.songUrl = Number(props.songId);
  localStorage.setItem('currentSongId', JSON.stringify(props.songId));
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="songListItem" class="song_list_item">
    <ul>
      <li id="serialNum" class="serial_num">{{ listId }}</li>
      <li id="clickToPlay" class="click_to_play" @click="playSong">
        <img src="../../../../assets/icons/playSong_songlist.svg" alt="播放" />
      </li>
      <li
        id="name"
        class="name"
        @click="jumpPage('song', Number(props.songId))"
      >
        {{ name }}
      </li>
      <li id="duration" class="duration">
        {{ processSongDuration(durationTime as number) }}
      </li>
      <li id="singer" class="singer">{{ singer_list() }}</li>
      <li
        id="album"
        class="album"
        v-if="String(props.type) != 'album'"
        @click="jumpPage('album', Number(props.albumId))"
      >
        {{ album }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss"></style>
