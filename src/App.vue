<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import HelloTsx from './components/HelloTsx';
</script>

<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" a lt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- router-link组件可实现点击跳转，to属性后写入path的值即可 -->
  <!-- <router-link to="/">首页</router-link> |
  <router-link to="/about">关于页面</router-link> -->
  <!-- 路由的显示入口 -->
  <router-view></router-view>
  <!-- <HelloTsx /> -->
</template>

<style scoped></style>
