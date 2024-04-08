<script setup lang="ts">
import { computed } from 'vue';
import mainBanner from '../../components/article/HomeView/mainBanner/mainBanner.vue';
import playlistList from '../../components/article/playlistList/playlistList.vue';
import { useLoginStateStore } from '../../stores/loginState';

const loginStore = useLoginStateStore();
const loginState = computed(() => loginStore.getLoginState());
</script>

<template>
  <div class="home_recommend_view">
    <main>
      <section>
        <main-banner></main-banner>
        <div id="mianInfo" class="main_info">
          <playlistList type="hot"></playlistList>
          <playlistList v-if="loginState" type="personal"></playlistList>
        </div>
      </section>
    </main>
  </div>
</template>
<style scoped>
.home_recommend_view {
  width: 100%;
  .main_info {
    position: relative;
    width: 100%;
    min-height: 92vh;
    height: 100%;
    padding-top: 40px;
    z-index: 0;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 3px 0 #4e53548d;
  }
}
</style>
