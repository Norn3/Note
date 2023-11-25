<template>
  <main class="playlist_info_view">
    <section>
      <info-page
        :target_id="String(route.query.pid)"
        type="playlist"
      ></info-page>
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

import InfoPage from '../components/article/InfoPage/InfoPage.vue';

// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
