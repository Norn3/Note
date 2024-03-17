<template>
  <div id="playingList" class="playinglist">
    <ul id="playingListTitle" class="playinglist_title">
      <div id="titleText" class="title_text">
        {{ '播放列表(' + playlist_length + ')' }}
      </div>
      <div class="playinglist_features">
        <div id="clearPlayinglist" class="clear_playinglist">删除</div>
      </div>
    </ul>
    <ul id="songList" class="songlist">
      <li
        :id="`playinglistItem${index}`"
        class="playinglist_item"
        v-for="(item, index) in playing_list"
        :key="'playinglistItem' + index"
        @click="clickToPlay(index)"
      >
        <div id="title" class="title">{{ item.name }}</div>
        <div id="creator" class="creator">
          {{ processCreatorName(item.ar) }}
        </div>
        <div id="duration" class="duration">
          {{ processSongDuration(item.dt) }}
        </div>
      </li>
    </ul>
    <el-text v-if="already_getting" v-loading="already_getting" class="loading"
      >Loading...</el-text
    >
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import {
  onMounted,
  nextTick,
  ref,
  render,
  h,
  watch,
  onBeforeUnmount,
} from 'vue';

import processSongDuration from '../../../util/processSongDuration';

import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

import './playingList.scss';

const already_getting = ref(false);

const listStore = useCurrentPlayingListStore();

const playing_list = ref<any[]>(listStore.playing_list);
const playlist_length = ref(listStore.playing_list.length);

const processCreatorName = (item: any) => {
  let creator_name = '';
  item.forEach((item: any) => {
    if (creator_name == '') creator_name += item.name;
    else creator_name += '/' + item.name;
  });
  return creator_name;
};

const showCurItem = () => {
  $('.playinglist_item').removeClass('check');
  $(`#playinglistItem${listStore.current_song_index}`).addClass('check');
};

const clickToPlay = (index: number) => {
  listStore.playSong(listStore.getSongId(index));
};

onMounted(() => {
  showCurItem();
  watch(
    () => listStore.playing_list,
    (newValue, oldValue) => {
      playing_list.value = newValue;
      playlist_length.value = newValue.length;
    }
  );
  $('#clearPlayinglist')[0].addEventListener('click', () => {
    listStore.clearList();
  });
});

watch(() => listStore.current_song_index, showCurItem);
</script>
