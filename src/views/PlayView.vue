<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import sideBar from '../components/sideBar/sideBar.vue';
import navBar from '../components/navBar/navBar.vue';
import audioPlayer from '../components/audioPlayer/audioPlayer.vue';

// const route = useRoute()
$(document).on('click', '#title', () => {
  jumpPage();
});

const router = useRouter();
const jumpPage = () => {
  router.push({
    name: 'home',
  });
};

const itemNum = ref(12);
const listItem = reactive([
  'Item1468854638/763548484854',
  'Item2',
  'Item3',
  'Item4',
  'Item5',
  'Item6',
]);

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
  <div class="play_view">
    <header></header>
    <article>
      <nav>
        <nav-bar></nav-bar>
      </nav>
      <aside>
        <side-bar :itemNum="itemNum" :listItem="listItem"></side-bar>
      </aside>
      <section></section>
    </article>
    <footer>
      <audio-player id="audioPlayer"></audio-player>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
.play_view {
  position: relative;
  width: 100vw;
  height: 100vh;
}
article {
  position: relative;
  height: 100%;
}
aside {
  height: 100%;
}
footer {
  position: relative;
  bottom: 0;
  width: 100%;
  height: 8%;
}
</style>
