<template>
  <!-- router-link组件可实现点击跳转，to属性后写入path的值即可 -->
  <!-- <router-link to="/">首页</router-link> |
  <router-link to="/about">关于页面</router-link> -->
  <div class="main_view">
    <header>
      <brand-icon></brand-icon>
      <header-nav></header-nav>
      <search-frame popper_class="popper upper"></search-frame>
      <account-bar></account-bar>
    </header>
    <section>
      <router-view></router-view>
    </section>
    <footer>
      <audio-player id="audioPlayer"></audio-player>
    </footer>
  </div>

  <!-- 路由的显示入口 -->
</template>

<style lang="scss" scoped>
@import './mainStyle.scss';
.main_view {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-color: #ffffff;

  header {
    position: fixed;
    height: 8vh;
    width: 100vw;
    display: flex;
    background-color: $brandColor;
    z-index: $headerZIndex;
    box-shadow: 0 1px 2px 0px #00000024;
  }
  section {
    position: relative;
    top: 8vh;
    width: $sectionWidth;
    min-height: 92vh;
    height: 100%;
    margin: auto;
  }
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 8vh;
    z-index: $footerZIndex;
    // 随着缩小，消失顺序：进度条、音量调节、封面、上一首、下一首，最后只剩播放图标
    min-height: 50px;
    min-width: 50px;
  }
  @media screen and (max-height: 500px) {
    header {
      height: 40px;
    }
    section {
      top: 40px;
    }
  }
  /*@media screen and (max-width: 768px) {
    .hidden-xs{
        display: none;
    }
  }

  @media screen and (min-width: 768px) and (max-width:992px) {
    .hidden-sm {
        display: none;
    }
  }

  @media screen and (min-width: 992px) and (max-width:1200px) {
    .hidden-md {
        display: none;
    }
  }

  @media screen and (min-width: 1200px) {
    .hidden-lg {
        display: none;
    }
  }*/
}
</style>
<script setup lang="ts">
import $ from 'jquery';

import brandIcon from './components/header/icon/brandIcon.vue';
import searchFrame from './components/header/search/searchFrame.vue';
import accountBar from './components/header/account/accountBar.vue';
import audioPlayer from './components/footer/audioPlayer/audioPlayer.vue';
import headerNav from './components/header/nav/headerNav.vue';

import { useCurrentPlayingListStore } from './stores/currentPlayingList';

const listStore = useCurrentPlayingListStore();

// 初始化歌单列表
listStore.initializeStore();

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
