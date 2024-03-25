<template>
  <div class="home_view">
    <main>
      <nav>
        <nav-bar id="navBar"></nav-bar>
      </nav>
      <section>
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>
<style scoped lang="scss">
@import '../../mainStyle.scss';
.home_view {
  width: 100%;

  main {
    width: 100%;

    nav {
      position: fixed;
      left: 0;
      width: 100vw;
      height: 5vh;
      z-index: $navbarZIndex;
      background-color: $subBrandColor;
      box-shadow: 0 3px 3px 0px #00000007;
      @media screen and (max-height: 600px) {
        display: none;
      }
    }
    section {
      position: relative;
      top: 5vh;
      width: 100%;
    }
  }
}
</style>
<script setup lang="ts">
import navBar from '../../components/article/HomeView/navBar/navBar.vue';
</script>
