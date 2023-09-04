<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import HelloTsx from './components/HelloTsx';
</script>

<template>
  <!-- router-link组件可实现点击跳转，to属性后写入path的值即可 -->
  <!-- <router-link to="/">首页</router-link> |
  <router-link to="/about">关于页面</router-link> -->
  <!-- 路由的显示入口 -->
  <router-view></router-view>
</template>

<style scoped></style>
