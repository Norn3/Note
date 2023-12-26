<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick } from 'vue';
import router from '../../../router/index';
// import { get } from '../../../axios/insatance';
import processPlayCount from '../../../util/processPlayCount';

import './PlayList.scss';

const props = defineProps({
  type: String,
  info: String,
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

const jumpPage = () => {
  sessionStorage.setItem('lastPathName', 'Info');
  sessionStorage.setItem(
    'lastPathQuery',
    JSON.stringify({ type: 'playlist', id: props.info })
  );
  router.push({
    name: 'Info',
    query: { type: 'playlist', id: props.info },
  });
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div
    id="playlist"
    class="play-list-container"
    :info="info"
    @click="jumpPage()"
  >
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
        <div id="playButton" class="play-button"></div>
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
