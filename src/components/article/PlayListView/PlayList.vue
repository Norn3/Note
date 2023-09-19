<script setup lang="ts">
import $ from 'jquery';
import { onMounted, nextTick } from 'vue';
import PlayListItem from '../../../class/PlayListItem';
// import { get } from '../../../axios/insatance';

import './PlayList.scss';

const props = defineProps({
  src: String,
  info: PlayListItem,
});

// const createItem =  () => {
//     const $image = $('#image');
//     let testObserver = new MutationObserver(() => {
//         const newurl = $image.attr('src');
//         $image.css('background', `url(${newurl}) no-repeat`)
//         $image.css('background-size', '100%, 100%')
//     });
//     const image =  $image[0]
//     testObserver.observe(image, {
//         attributeFilter: ['src'], // 标签所带的属性都可添加，包括自定义属性
//     });
// }

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
  // createItem();
});
</script>
<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div id="playList" class="play-list-container" :info="info">
    <div id="image" class="image" :src="src">
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
