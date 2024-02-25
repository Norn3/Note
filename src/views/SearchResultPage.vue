<template>
  <main class="info_view">
    <section>
      <span>{{ String(route.query.keyword) }}</span>
      <search-frame
        class="new_search"
        popper_class="popper lower"
      ></search-frame>
      <div id="searchResult" class="search_result">
        <div id="searchCategory" class="search_category"></div>
        <div id="searchList" class="search_list"></div>
      </div>
    </section>
  </main>
</template>
<style lang="scss" scoped>
.info_view {
  position: relative;
  width: 75vw;
  min-height: 92vh;
  height: 100%;
  padding: 0 0 50px 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 3px 0 #4e53548d;

  section {
    position: relative;
    min-height: 100vh;
    height: 100%;
    width: 70vw;
    margin: 0 auto;

    .new_search {
      position: relative;
      top: 0;
      right: 0;
      margin: 0 auto;
      width: 70%;
      height: 70px;
    }

    .search_result {
      display: flex;
    }
  }
}
</style>

<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { nextTick, onMounted, reactive, ref, h, render, onUpdated } from 'vue';
import { useRoute } from 'vue-router';

import songList from '../components/article/songList/songList.vue';
import searchFrame from '../components/header/search/searchFrame.vue';
// 获取路由参数pid，用于获取歌单详情渲染页面
const route = useRoute();

onMounted(async () => {
  // 等待页面加载结束，再调用createItem创建列表项
  await nextTick();
});
</script>
