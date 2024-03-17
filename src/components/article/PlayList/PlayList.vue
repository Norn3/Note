<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="playlist" class="play-list-container" :info="id" @click="jumpPage()">
    <div
      id="image"
      class="image"
      :style="{ 'background-image': `url(${imgUrl})` }"
    >
      <div id="mask" class="mask">
        <div id="playCount" class="play-count">
          <div id="icon" class="icon"></div>
          <div id="number" class="number">
            {{ processPlayCount(props.playCount) }}
          </div>
        </div>
        <div id="playButton" class="play-button" @click.stop="playlist"></div>
      </div>
    </div>
    <div id="description" class="description">
      <a href="" id="title" class="title">{{ title }}</a>
      <div id="creatorTitle" class="creatorTitle" v-if="showCreator">
        by<a href="" id="creator" class="creator">{{ creator }}</a>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick } from 'vue';
import router from '../../../router/index';
// import { get } from '../../../axios/insatance';

import processPlayCount from '../../../util/processPlayCount';

import { useCurrentPlayingListStore } from '../../../stores/currentPlayingList';

import './PlayList.scss';

const props = defineProps({
  type: String,
  id: String,
  imgUrl: String,
  playCount: {
    type: Number,
    default: 0,
  },
  title: String,
  creator: String,
  showCreator: {
    type: Boolean,
    default: false,
  },
});

const listStore = useCurrentPlayingListStore();

const jumpPage = () => {
  sessionStorage.setItem('lastPathName', 'Info');
  sessionStorage.setItem(
    'lastPathQuery',
    JSON.stringify({ type: 'playlist', id: props.id })
  );
  console.log(props.id);

  router.push({
    name: 'Info',
    query: { type: 'playlist', id: props.id },
  });
};

// TODO：点击播放列表，没有loading态而且过程很长
const playlist = async () => {
  await listStore.changeList('playlist', props.id as string);
  listStore.resetCurSong();
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
