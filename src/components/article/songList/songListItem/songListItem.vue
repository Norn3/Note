<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div
    :id="'songListItem' + listId"
    class="song_list_item"
    :key="'songListItem' + listId"
  >
    <ul>
      <li
        id="serialNum"
        class="serial_num"
        v-if="props.type != 'search_result'"
      >
        {{ listId }}
      </li>
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
      <li
        id="duration"
        class="duration"
        @mouseover="showFeature = true"
        @mouseleave="showFeature = false"
      >
        <span v-if="!showFeature" id="durationTime" class="duration_time">{{
          processSongDuration(durationTime as number)
        }}</span>
        <ul v-else id="featureList" class="feature_list">
          <li
            v-if="playlistId != ''"
            id="removeFromList"
            class="remove_from_list"
            @click="removeSongFromList"
          ></li>
        </ul>
      </li>
      <li id="singer" class="singer" v-if="String(props.type) != 'artist'">
        {{ singer_list() }}
      </li>
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
<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick, ref, useAttrs, watch } from 'vue';
import router from '../../../../router/index';
import { get } from '../../../../axios/insatance';

import { useCurrentPlayingListStore } from '../../../../stores/currentPlayingList';
import { useuserPlaylistStore } from '../../../../stores/userPlaylist';

import processSongDuration from '../../../../util/processSongDuration'; // 处理时长

import './songListItem.scss';

const showFeature = ref(false);

const props = defineProps({
  type: String,
  listId: Number,
  playlistId: String,
  songId: Number,
  name: String,
  durationTime: Number,
  singer: Array<string>,
  album: String,
  albumId: Number,
});

// TODO: 后续应该实现点击跳转到对应歌手，解决方案，hover时出现一个气泡展示所有歌手，然后点击单个跳转到artistInfoView
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

const listStore = useCurrentPlayingListStore();
const userPlaylistStore = useuserPlaylistStore();

// TODO：点击播放单曲，没有loading态而且过程很长
const playSong = () => {
  listStore.playSong(String(props.songId));
};

const removeSongFromList = () => {
  if (!props.playlistId) return;
  userPlaylistStore.setCollectingSongId(String(props.songId));
  userPlaylistStore.processSongInPlaylist('del', props.playlistId);
};
</script>
