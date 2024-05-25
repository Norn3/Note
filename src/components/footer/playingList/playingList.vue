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
        @mouseover="changeHovering(index, 'over')"
        @mouseleave="changeHovering(index, 'leave')"
      >
        <div id="title" class="title">{{ item.name }}</div>
        <div id="creator" class="creator">
          {{ processCreatorName(item.ar) }}
        </div>
        <div id="duration" class="duration">
          <span id="durationTime">{{ processSongDuration(item.dt) }}</span>
          <ul id="features" class="features">
            <li>
              <div
                class="favorite_icon"
                @click.stop="favoriteSong(item.id)"
              ></div>
            </li>
            <li>
              <div
                class="delete_icon"
                @click.stop="deleteFromPlayinglist(index)"
              ></div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <loading-state :loading="already_getting"></loading-state>
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
import loadingState from '../../article/loadingState/loadingState.vue';

import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';
import { useuserPlaylistStore } from '../../../stores/userPlaylist';
import { useLoginStateStore } from '../../../stores/loginState';

import './playingList.scss';

const already_getting = ref(false);

const hovering = ref(false);

const listStore = useCurrentPlayingListStore();
const userPlaylistStore = useuserPlaylistStore();
const loginStore = useLoginStateStore();

const playing_list = ref<any[]>(listStore.playing_list);
const playlist_length = ref(listStore.playing_list.length);

const processCreatorName = (item: any) => {
  let creator_name = '';
  if (!item) return;
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

const changeHovering = (index: number, type: string) => {
  const $listItem = $('#playinglistItem' + index);
  if (type == 'leave') {
    $listItem.find('#features').css('display', 'none');
    $listItem.find('#durationTime').css('display', 'inline');
  } else if (type == 'over') {
    $listItem.find('#features').css('display', 'flex');
    $listItem.find('#durationTime').css('display', 'none');
  }
};

const clickToPlay = (index: number) => {
  listStore.playSong(listStore.getSongId(index));
};

const favoriteSong = (songId: string) => {
  if (loginStore.getLoginState()) {
    userPlaylistStore.showCollectFrame(String(songId));
  } else {
    loginStore.showLoginEntry();
  }
};

const deleteFromPlayinglist = (index: number) => {
  listStore.deleteSong(index);
};

onMounted(() => {
  showCurItem();
  watch(
    () => listStore.playing_list,
    async (newValue, oldValue) => {
      playing_list.value = newValue;
      playlist_length.value = newValue.length;
      await nextTick();
      showCurItem();
    },
    { deep: true }
  );
  $('#clearPlayinglist')[0].addEventListener('click', () => {
    listStore.clearList();
  });
});

watch(
  () => listStore.current_song_index,
  async () => {
    await nextTick();
    showCurItem();
  }
);
</script>
