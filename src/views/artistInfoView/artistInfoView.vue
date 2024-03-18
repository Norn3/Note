<template>
  <main class="artist_info_view">
    <section>
      <div>{{ JSON.stringify(route.query) }}</div>
      <!-- <song-list
          v-if="String(route.query.type) != 'song'"
          :type="String(route.query.type)"
          :target_id="String(route.query.id)"
        ></song-list> -->
    </section>
  </main>
</template>
<style lang="scss" scoped>
.artist_info_view {
  position: relative;
  width: 75vw;
  min-height: 92vh;
  height: 100%;
  padding: 0 0 50px 0;
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
// 展示歌曲、歌单等资源的信息，无侧边栏

// import { useRoute } from 'vue-router'
import { useRoute } from 'vue-router';

import InfoPage from '../../components/article/InfoPage/InfoPage.vue';
import songList from '../../components/article/songList/songList.vue';
// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();
</script>
