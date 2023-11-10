<script setup lang="ts">
import $, { event } from 'jquery';
import { onMounted, nextTick } from 'vue';
import router from '../../../router/index';
import PlaylistItem from '../../../class/PlaylistItemClass';
// import { get } from '../../../axios/insatance';

import './PlayList.scss';

const props = defineProps({
  info: String,
});

const jumpPage = () => {
  console.log(router);

  router.push({
    name: 'playlistInfo',
    query: { pid: props.info },
  });
};

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();

  // createItem();
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
    <div id="image" class="image">
      <div id="mask" class="mask">
        <div id="playCount" class="play-count">
          <div id="icon" class="icon"></div>
          <div id="number" class="number"></div>
        </div>
        <div id="playButton" class="play-button"></div>
      </div>
    </div>
    <div id="description" class="description">
      <a href="" id="title" class="title"></a>
      <div id="creatorTitle" class="creatorTitle">
        by<a href="" id="creator" class="creator"></a>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
