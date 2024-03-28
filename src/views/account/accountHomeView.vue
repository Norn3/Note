<template>
  <div class="account_view">
    <main>
      <section v-if="createList.length || faroviteList.length">
        <playlistList
          v-if="createList.length"
          type="myCreate"
          :playlists="createList"
        ></playlistList>
        <playlistList
          v-if="faroviteList.length"
          type="myFavorite"
          :playlists="faroviteList"
        ></playlistList>
      </section>
      <noData v-else></noData>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@import '../../mainStyle.scss';
.account_view {
  position: relative;
  width: 100%;
  min-height: 92vh;
  height: 100%;
  background-color: rgb(255, 255, 255);
}
main {
  position: relative;
  min-height: 92vh;
  height: 100%;
  display: flex;
  box-shadow: 0 0 3px 0 #4e53548d;
}
aside {
  position: relative;
  min-height: 92vh;
  width: 25%;
}
section {
  position: relative;
  height: 100%;
  min-height: 92vh;
  width: 100%;
  margin: 0 auto;
  .playlistTitle {
    margin: 20px;
    border-bottom: 2px solid $audioCurrentState;
    display: flex;
    h1 {
      position: relative;
      display: inline-block;
      margin: 10px;
      margin-left: 40px;
      font-weight: 500;
    }
  }
  .playlists {
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
// import { useRoute } from 'vue-router'
import $ from 'jquery';
import {
  nextTick,
  onMounted,
  reactive,
  ref,
  h,
  render,
  onBeforeMount,
} from 'vue';
import { useRouter } from 'vue-router';
import { get } from '../../axios/insatance';

import { useLoginStateStore } from '../../stores/loginState';

import playlistList from '../../components/article/playlistList/playlistList.vue';
import noData from '../../components/article/noData/noData.vue';

const loginState = useLoginStateStore();
const uid = loginState.getProfile().userId;

const createList = ref([]);
const faroviteList = ref([]);

const getPlaylists = (uid: string) => {
  get<any>(`/user/playlist?uid=${uid}`)
    .then((response) => {
      const playlist = response.playlist;
      let slice = 0;
      for (let element of playlist) {
        if (element.userId != uid) break;
        slice++;
      }
      createList.value = playlist.slice(0, slice);
      faroviteList.value = playlist.slice(slice, playlist.length);
      console.log(createList.value);
    })
    .catch((error) => {
      // 处理请求错误
      console.log('请求失败');
      console.log(error);
    });
};

onMounted(() => {
  getPlaylists(uid);
});
</script>
