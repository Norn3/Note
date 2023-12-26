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
<style scoped></style>
