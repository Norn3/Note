<template>
  <div class="home_rank_view">
    <main>
      <aside>
        <side-bar listType="ranklist"></side-bar>
      </aside>
      <section>
        <router-view></router-view>
      </section>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@import '../../mainStyle.scss';
.home_rank_view {
  position: relative;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
main {
  position: relative;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  box-shadow: 0 0 3px 0 #4e53548d;
}
aside {
  position: fixed;
  min-height: 92vh;
  width: 20%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(209, 214, 219);
  }
}
section {
  position: relative;
  height: 100%;
  width: 80%;
  left: 20%;
  margin: 0;
  .playListTitle {
    position: relative;
    height: 4em;
    margin: 20px;
    border-bottom: 2px solid rgb(114, 152, 233);
    h1 {
      position: absolute;
      left: 10px;
      display: inline-block;
      margin: 10px;
      font-weight: 500;
    }
  }
  .playLists {
    box-sizing: border-box;
    height: auto;
    width: 100%;
    padding: 0 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    content-visibility: auto;
  }
}
</style>
<script setup lang="ts">
import $ from 'jquery';
import { reactive, onBeforeMount } from 'vue';
import { get } from '../../axios/insatance';

import SideBar from '../../components/article/sideBar/sideBar.vue';
</script>
