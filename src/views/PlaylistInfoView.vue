<template>
  <main class="playlist_info_view">
    <section>
      <playlist-info :playlist_id="String(route.query.pid)"></playlist-info>
    </section>
  </main>
</template>
<style lang="scss" scoped>
.playlist_info_view {
  position: relative;
  width: 75vw;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 3px 0 #4e53548d;
}

section {
  position: relative;
  min-height: 100vh;
  height: 100%;
  width: 70vw;
  margin: 0 auto;
}
</style>

<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { nextTick, onMounted, reactive, ref, h, render } from 'vue';
import { useRoute } from 'vue-router';
import { get } from '../axios/insatance';

import PlaylistInfo from '../components/article/playlistInfo/playlistInfo.vue';

// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
