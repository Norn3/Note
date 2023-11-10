<script setup lang="ts">
import mainBanner from '../../components/article/HomeView/mainBanner/mainBanner.vue';
</script>

<template>
  <div class="home_recommend_view">
    <main>
      <nav>
        <nav-bar id="navBar"></nav-bar>
      </nav>
      <section>
        <main-banner></main-banner>
        <recommend-play-list></recommend-play-list>
        <recommend-play-list id="personal"></recommend-play-list>
      </section>
    </main>
  </div>
</template>
<style scoped></style>
