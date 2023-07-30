<script setup lang="ts">
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import sideBar from '../components/sideBar/sideBar.vue';
import navBar from '../components/navBar/navBar.vue';

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
  <!-- <h1 id="title">PlayView</h1> -->
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
  <footer></footer>
</template>
<style scoped></style>
