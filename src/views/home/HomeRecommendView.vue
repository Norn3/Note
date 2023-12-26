<script setup lang="ts">
import mainBanner from '../../components/article/HomeView/mainBanner/mainBanner.vue';
import recommendPlaylist from '../../components/article/HomeView/recommendPlaylist/recommendPlaylist.vue';
</script>

<template>
  <div class="home_recommend_view">
    <main>
      <nav>
        <nav-bar id="navBar"></nav-bar>
      </nav>
      <section>
        <main-banner></main-banner>
        <div id="mianInfo" class="main_info">
          <recommend-playlist></recommend-playlist>
          <!-- <recommend-play-list id="personal"></recommend-play-list> -->
        </div>
      </section>
    </main>
  </div>
</template>
<style scoped>
.main_info {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  z-index: 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 3px 0 #4e53548d;
}
</style>
