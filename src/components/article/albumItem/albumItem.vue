<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div
    id="albumContainer"
    class="album_container"
    :info="id"
    @click="jumpPage()"
  >
    <div
      id="image"
      class="image"
      :style="{ 'background-image': `url(${imgUrl})` }"
    >
      <div id="mask" class="mask">
        <div id="playButton" class="play-button" @click.stop="playAlbum"></div>
      </div>
    </div>

    <div id="description" class="description">
      <div id="title" class="title">{{ title }}</div>
      <ul id="artists" class="artists">
        <li
          id="artist"
          class="artist"
          v-for="(item, index) in artists"
          :key="index"
        >
          {{ (index == 0 ? '' : '/') + item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick } from 'vue';
import router from '../../../router/index';
// import { get } from '../../../axios/insatance';

import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

import './albumItem.scss';

const props = defineProps({
  id: String,
  imgUrl: String,
  title: String,
  artists: Array<string>,
});

const listStore = useCurrentPlayingListStore();

const jumpPage = () => {
  sessionStorage.setItem('lastPathName', 'Info');
  sessionStorage.setItem(
    'lastPathQuery',
    JSON.stringify({ type: 'album', id: props.id })
  );

  router.push({
    name: 'Info',
    query: { type: 'album', id: props.id },
  });
};

// TODO：点击播放列表，没有loading态而且过程很长
const playAlbum = async () => {
  await listStore.changeList('album', props.id as string);
  listStore.resetCurSong();
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
