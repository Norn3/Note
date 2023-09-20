<script setup lang="ts">
import $ from 'jquery';

import HelloWorld from './components/HelloWorld.vue';
import HelloTsx from './components/HelloTsx';
import brandIcon from './components/header/icon/brandIcon.vue';
import searchFrame from './components/header/search/searchFrame.vue';
import accountBar from './components/header/account/accountBar.vue';
import audioPlayer from './components/footer/audioPlayer/audioPlayer.vue';

// 鼠标在上方时audioPlayer出现
$(document).on('mouseover', 'footer', () => {
  const audioPlayer = $('#audioPlayer')[0];
  audioPlayer.classList.add('active');
});
// 鼠标移开时audioPlayer消失
$(document).on('mouseout', 'footer', () => {
  const audioPlayer = $('#audioPlayer')[0];
  audioPlayer.classList.remove('active');
});
</script>

<template>
  <!-- router-link组件可实现点击跳转，to属性后写入path的值即可 -->
  <!-- <router-link to="/">首页</router-link> |
  <router-link to="/about">关于页面</router-link> -->
  <div class="mainView">
    <header>
      <brand-icon></brand-icon>
      <search-frame></search-frame>
      <account-bar></account-bar>
    </header>
    <article>
      <router-view></router-view>
    </article>
    <footer>
      <audio-player id="audioPlayer"></audio-player>
    </footer>
  </div>

  <!-- 路由的显示入口 -->
</template>

<style lang="scss" scoped>
.mainView {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  height: auto;

  header {
    position: fixed;
    height: 8vh;
    width: 100%;
    background-color: #ffffee;
    z-index: 1;
  }
  article {
    position: relative;
    top: 8vh;
    margin: auto;
    width: 80vw;
    min-height: 92vh;
    height: 100%;
  }
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 8vh;
  }
}
</style>
