<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import sideBar from '../components/article/sideBar/sideBar.vue';
import navBar from '../components/article/HomeView/navBar/navBar.vue';

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
</script>

<template>
  <div class="play_view">
    <article>
      <nav></nav>
      <aside>
        <side-bar :itemNum="itemNum" :listItem="listItem"></side-bar>
      </aside>
      <section></section>
    </article>
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
</style>
