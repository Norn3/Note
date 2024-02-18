<script setup lang="ts">
import navBar from '../../components/article/HomeView/navBar/navBar.vue';
</script>

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
<style scoped>
.home_view {
  width: 100%;

  main {
    width: 100%;

    nav {
      width: 100%;
    }
    section {
      width: 100%;
    }
  }
}
</style>
